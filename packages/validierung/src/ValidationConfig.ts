import {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './validationBehavior'

class ValidationConfig {
  defaultValidationBehavior: ValidationBehaviorString | null = null
  validationBehavior: Map<string, ValidationBehaviorFunction> = new Map()

  getDefaultValidationBehavior(): ValidationBehaviorFunction {
    if (this.defaultValidationBehavior === null) {
      return () => true
    }
    return this.validationBehavior.get(this.defaultValidationBehavior)!
  }
}

export const validationConfig = new ValidationConfig()
