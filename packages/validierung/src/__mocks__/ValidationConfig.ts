export const ValidationConfig = jest.fn<any, any>().mockImplementation(() => {
  const { ValidationConfig } = jest.requireActual('../validationConfig')

  class MockValidationConfig extends ValidationConfig {
    constructor() {
      super()
      this.validationBehavior.set('mock', () => true)
    }
  }

  return new MockValidationConfig()
})

export const validationConfig = new ValidationConfig()
