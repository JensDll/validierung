const { ValidationConfig: ActualValidationConfig } = await vi.importActual(
  '../validationConfig'
)

export const ValidationConfig = vi.fn(() => {
  class MockValidationConfig extends ActualValidationConfig {}

  return new MockValidationConfig()
})

export const validationConfig = new ValidationConfig()
