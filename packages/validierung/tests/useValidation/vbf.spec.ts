import { ref, nextTick } from 'vue-demi'

import { createValidation } from '~validierung/createValidation'
import { useValidation } from '~validierung/useValidation'
import type { ValidationBehaviorInfo } from '~validierung/validationBehavior'

vi.mock('../../src/validationConfig')

const consoleWarnMock = vi.spyOn(console, 'warn')

test('when touched', async () => {
  const vbf = vi.fn()
  const rule = vi.fn()

  const { form } = useValidation({
    a: {
      $value: ref(1),
      $rules: [[vbf, rule]]
    }
  })

  await form.a.$validate({ force: false })

  expect(vbf).toBeCalledTimes(1)
  expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
    dirty: false,
    force: false,
    hasError: false,
    submit: false,
    touched: true,
    value: 1
  })
})

test('when dirty', async () => {
  const vbf = vi.fn()
  const rule = vi.fn()

  const { form } = useValidation({
    a: {
      $value: 1,
      $rules: [[vbf, rule]]
    }
  })

  form.a.$value = 2
  await nextTick()

  expect(vbf).toBeCalledTimes(1)
  expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
    dirty: true,
    force: false,
    hasError: false,
    submit: false,
    touched: false,
    value: 2
  })
})

test('with force', async () => {
  const vbf = vi.fn()
  const rule = vi.fn()

  const { form } = useValidation({
    a: {
      $value: 1,
      $rules: [[vbf, rule]]
    }
  })

  await form.a.$validate({ setTouched: false, force: true })

  expect(vbf).toBeCalledTimes(1)
  expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
    dirty: false,
    force: true,
    hasError: false,
    submit: false,
    touched: false,
    value: 1
  })
})

test('with submit', async () => {
  const vbf = vi.fn()
  const rule = vi.fn()

  const { validateFields } = useValidation({
    a: {
      $value: 1,
      $rules: [[vbf, rule]]
    }
  })

  await validateFields()

  expect(vbf).toBeCalledTimes(1)
  expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
    dirty: false,
    force: false,
    hasError: false,
    submit: true,
    touched: true,
    value: 1
  })
})

test('with error', async () => {
  const vbf = vi.fn(() => true)
  const rule = vi.fn(() => '')

  const { form } = useValidation({
    a: {
      $value: 1,
      $rules: [[vbf, rule]]
    }
  })

  await form.a.$validate({ setTouched: false, force: false })
  await form.a.$validate({ setTouched: false, force: false })

  expect(vbf).toBeCalledTimes(2)
  expect(vbf).nthCalledWith<ValidationBehaviorInfo[]>(1, {
    dirty: false,
    force: false,
    hasError: false,
    submit: false,
    touched: false,
    value: 1
  })
  expect(vbf).nthCalledWith<ValidationBehaviorInfo[]>(2, {
    dirty: false,
    force: false,
    hasError: true,
    submit: false,
    touched: false,
    value: 1
  })
})

test('should use default', async () => {
  const vbf = vi.fn()
  const rule = vi.fn()

  createValidation({
    defaultValidationBehavior: 'mock' as never,
    validationBehavior: {
      mock: vbf
    }
  }).install()

  const { form } = useValidation({
    a: {
      $value: 1,
      $rules: [rule]
    }
  })

  await form.a.$validate()

  expect(vbf).toBeCalledTimes(1)
  expect(vbf).toBeCalledWith<ValidationBehaviorInfo[]>({
    dirty: false,
    force: true,
    hasError: false,
    submit: false,
    touched: true,
    value: 1
  })
})

test('should warn with invalid default', () => {
  createValidation({
    defaultValidationBehavior: 'invalid' as never,
    validationBehavior: {}
  }).install()

  expect(consoleWarnMock).toBeCalledTimes(1)
  expect(consoleWarnMock.mock.calls[0][0].startsWith('[validierung]')).toBe(
    true
  )
})

test('should throw error with invalid vbf', () => {
  expect(() =>
    useValidation({
      a: {
        $value: 1,
        $rules: [['invalid', () => {}]]
      }
    })
  ).toThrow('[validierung]')
})

test.each([
  { debounce: true, note: 'with debounce' },
  { debounce: false, note: 'without debounce' }
])('should only call rule when VBF is true ($note)', async ({ debounce }) => {
  let vbfReturn = false
  const vbf = vi.fn(() => vbfReturn)
  const rule = vi.fn()

  const { form } = useValidation({
    a: {
      $value: 1,
      $rules: [debounce ? [vbf, rule, 50] : [vbf, rule]]
    }
  })

  await form.a.$validate({ setTouched: false, force: false })

  expect(vbf).toBeCalledTimes(1)
  expect(vbf).lastCalledWith<ValidationBehaviorInfo[]>({
    dirty: false,
    force: false,
    hasError: false,
    submit: false,
    touched: false,
    value: 1
  })
  expect(rule).toBeCalledTimes(0)

  vbfReturn = true
  await form.a.$validate({ setTouched: false, force: false })

  expect(vbf).toBeCalledTimes(2)
  expect(vbf).lastCalledWith<ValidationBehaviorInfo[]>({
    dirty: false,
    force: false,
    hasError: false,
    submit: false,
    touched: false,
    value: 1
  })
  expect(rule).toBeCalledTimes(1)
})
