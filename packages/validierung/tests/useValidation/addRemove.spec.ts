import { watch, nextTick } from 'vue-demi'

import { useValidation } from '../../src/useValidation'
import type { Field } from '../../src/data/types'

type FormData = {
  a?: Field<string>
  xs: {
    b: Field<string>
    ys: { c: Field<number> }[]
  }[]
}

test('should add and remove and trigger reactive effects', async () => {
  const { form, add, remove } = useValidation<FormData>({ xs: [] })

  const mock = vi.fn()
  watch(form, mock, { deep: true })

  add(['a'], {
    $value: ''
  })
  await nextTick()

  expect(form).toStrictEqual({
    a: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $dirty: false,
      $touched: false,
      $validate: expect.any(Function)
    },
    xs: []
  })
  expect(mock).toBeCalledTimes(1)

  add(['xs'], {
    b: {
      $value: ''
    },
    ys: []
  })
  await nextTick()

  expect(form.xs).toStrictEqual([
    {
      b: {
        $uid: expect.any(Number),
        $value: '',
        $errors: [],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      },
      ys: []
    }
  ])
  expect(mock).toBeCalledTimes(2)

  add(['xs', 0, 'ys', 0], {
    c: {
      $value: 1
    }
  })
  await nextTick()

  expect(form.xs[0].ys).toStrictEqual([
    {
      c: {
        $uid: expect.any(Number),
        $value: 1,
        $errors: [],
        $hasError: false,
        $validating: false,
        $dirty: false,
        $touched: false,
        $validate: expect.any(Function)
      }
    }
  ])
  expect(mock).toBeCalledTimes(3)

  remove(['xs', 0, 'ys', 0])
  await nextTick()

  expect(form).toStrictEqual({
    a: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $dirty: false,
      $touched: false,
      $validate: expect.any(Function)
    },
    xs: [
      {
        b: {
          $uid: expect.any(Number),
          $value: '',
          $errors: [],
          $hasError: false,
          $validating: false,
          $dirty: false,
          $touched: false,
          $validate: expect.any(Function)
        },
        ys: []
      }
    ]
  })
  expect(mock).toBeCalledTimes(4)

  remove(['xs', 0, 'b'])
  await nextTick()

  expect(form).toStrictEqual({
    a: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $dirty: false,
      $touched: false,
      $validate: expect.any(Function)
    },
    xs: [
      {
        ys: []
      }
    ]
  })
  expect(mock).toBeCalledTimes(5)

  remove(['xs'])
  await nextTick()

  expect(form).toStrictEqual({
    a: {
      $uid: expect.any(Number),
      $value: '',
      $errors: [],
      $hasError: false,
      $validating: false,
      $dirty: false,
      $touched: false,
      $validate: expect.any(Function)
    }
  })
  expect(mock).toBeCalledTimes(6)

  remove(['a'])
  await nextTick()

  expect(form).toStrictEqual({})
  expect(mock).toBeCalledTimes(7)
})
