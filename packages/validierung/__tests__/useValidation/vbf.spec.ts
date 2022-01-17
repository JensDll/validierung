import { ref, nextTick } from 'vue-demi'

import { createValidation } from '../../src/createValidation'
import { useValidation } from '../../src/useValidation'
import { ValidationBehaviorInfo } from '../../src/validationBehavior'

jest.mock('../../src/validationConfig')

const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()

beforeEach(() => {
  consoleWarnMock.mockClear()
})

it('when touched', async () => {
  const vbf = jest.fn()
  const rule = jest.fn()

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

it('when dirty', async () => {
  const vbf = jest.fn()
  const rule = jest.fn()

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

it('with force', async () => {
  const vbf = jest.fn()
  const rule = jest.fn()

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

it('with submit', async () => {
  const vbf = jest.fn()
  const rule = jest.fn()

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

it('with error', async () => {
  const vbf = jest.fn(() => true)
  const rule = jest.fn(() => '')

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

it('should use default', async () => {
  const vbf = jest.fn()
  const rule = jest.fn()

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

it('should warn with invalid default', () => {
  createValidation({
    defaultValidationBehavior: 'invalid' as never,
    validationBehavior: {}
  }).install()

  expect(consoleWarnMock).toBeCalledTimes(1)
  expect(consoleWarnMock.mock.calls[0][0].startsWith('[validierung]')).toBe(
    true
  )
})

it('should throw error with invalid vbf', () => {
  expect(() =>
    useValidation({
      a: {
        $value: 1,
        $rules: [['invalid', () => {}]]
      }
    })
  ).toThrow('[validierung]')
})

it.each([
  { debounce: true, note: 'with debounce' },
  { debounce: false, note: 'without debounce' }
])('should only call rule when VBF is true ($note)', async ({ debounce }) => {
  let vbfReturn = false
  const vbf = jest.fn(() => vbfReturn)
  const rule = jest.fn()

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
