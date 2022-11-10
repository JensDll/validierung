const { ValidationConfig: ActualValidationConfig } = await vi.importActual<any>(
  '~validierung/validationConfig'
)

class MockValidationConfig extends ActualValidationConfig {}

export const ValidationConfig = vi.fn(() => new MockValidationConfig())

export const validationConfig = new ValidationConfig()
