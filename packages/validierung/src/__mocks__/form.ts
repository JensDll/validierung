const { Form: ActualForm } = await vi.importActual('../form')

export const Form = vi.fn<any, any>().mockImplementation(() => {
  class MockForm extends ActualForm {
    dispose = vi.fn(uid => super.dispose(uid))

    validate = vi.fn(uid => super.validate(uid))

    registerField = vi.fn((uid, name, modelValue, ruleInfos) =>
      super.registerField(uid, name, modelValue, ruleInfos)
    )

    getField = vi.fn(uid => super.getField(uid))
  }

  return new MockForm()
})
