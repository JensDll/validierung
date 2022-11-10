import type { Mock } from 'vitest'
import { nextTick } from 'vue-demi'

import type { Field, TransformFormData } from '~validierung/data/types'
import { useValidation } from '~validierung/useValidation'

type FormData = {
  a: Field<string>
  bs: Field<number[]>
  c: Field<{ a: string }>
  ds: {
    e: Field<string>
    fs: {
      g: Field<{
        a: {
          bs: number[]
        }
      }>
    }[]
  }[]
}

function setup() {
  const rule = vi.fn()
  const $rules = [[() => true, rule]] as any

  const val = useValidation<FormData>({
    a: { $value: '', $rules },
    bs: { $value: [1, 2, 3], $rules },
    c: { $value: { a: '' }, $rules },
    ds: [
      {
        e: { $value: '', $rules },
        fs: [
          {
            g: { $value: { a: { bs: [4, 5, 6] } }, $rules: [{ key: 'key' }] }
          }
        ]
      },
      {
        e: { $value: '', $rules },
        fs: [
          {
            g: { $value: { a: { bs: [7, 8, 9] } }, $rules: [{ key: 'key' }] }
          }
        ]
      }
    ]
  })

  return { ...val, rule }
}

const changeFormValues = async (
  form: TransformFormData<FormData>,
  rule: Mock
) => {
  form.a.$value = 'x'
  form.bs.$value[0] = -1
  form.bs.$value[1] = -1
  form.bs.$value[2] = -1
  form.c.$value.a = 'x'
  form.ds[0].e.$value = 'x'
  form.ds[0].fs[0].g.$value.a.bs[0] = -1
  form.ds[0].fs[0].g.$value.a.bs[1] = -1
  form.ds[0].fs[0].g.$value.a.bs[2] = -1
  form.ds[1].e.$value = 'x'
  form.ds[1].fs[0].g.$value.a.bs[0] = -1
  form.ds[1].fs[0].g.$value.a.bs[1] = -1
  form.ds[1].fs[0].g.$value.a.bs[2] = -1

  await nextTick()

  rule.mockReset()
}

test('should not change result data when changing form after submitting', async () => {
  const { form, rule, validateFields } = setup()

  const promise = validateFields()

  await changeFormValues(form, rule)

  const resultData = await promise

  expect(resultData).toStrictEqual<typeof resultData>({
    a: '',
    bs: [1, 2, 3],
    c: { a: '' },
    ds: [
      {
        e: '',
        fs: [
          {
            g: { a: { bs: [4, 5, 6] } }
          }
        ]
      },
      {
        e: '',
        fs: [
          {
            g: { a: { bs: [7, 8, 9] } }
          }
        ]
      }
    ]
  })
})

test('should reset to default values', async () => {
  const { form, rule, resetFields } = setup()

  for (let i = 0; i < 10; i++) {
    changeFormValues(form, rule)

    resetFields()
    await nextTick()

    expect(form.a.$value).toStrictEqual('')
    expect(form.bs.$value).toStrictEqual([1, 2, 3])
    expect(form.c.$value).toStrictEqual({ a: '' })
    expect(form.ds[0].e.$value).toStrictEqual('')
    expect(form.ds[0].fs[0].g.$value).toStrictEqual({
      a: { bs: [4, 5, 6] }
    })
    expect(form.ds[1].e.$value).toBe('')
    expect(form.ds[1].fs[0].g.$value).toStrictEqual({
      a: { bs: [7, 8, 9] }
    })

    expect(rule).toBeCalledTimes(0)
  }
})

test('should reset to specific values', async () => {
  const { form, rule, resetFields } = setup()

  for (let i = 0; i < 10; i++) {
    await changeFormValues(form, rule)

    resetFields({
      a: '1',
      bs: [10, 11, 12],
      c: { a: '2' },
      ds: [{ e: '3', fs: [{ g: { a: { bs: [13, 14, 15] } } }] }]
    })
    await nextTick()

    expect(form.a.$value).toStrictEqual('1')
    expect(form.bs.$value).toStrictEqual([10, 11, 12])
    expect(form.c.$value).toStrictEqual({ a: '2' })
    expect(form.ds[0].e.$value).toStrictEqual('3')
    expect(form.ds[0].fs[0].g.$value).toStrictEqual({
      a: { bs: [13, 14, 15] }
    })
    expect(form.ds[1].e.$value).toBe('x')
    expect(form.ds[1].fs[0].g.$value).toStrictEqual({
      a: { bs: [-1, -1, -1] }
    })

    expect(rule).toBeCalledTimes(0)
  }
})
