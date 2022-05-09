import type {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './validationBehavior'

export class ValidationConfig {
  defaultValidationBehavior: ValidationBehaviorString | null = null
  vbfMap: Map<string, ValidationBehaviorFunction> = new Map()

  getDefaultVbf(): ValidationBehaviorFunction {
    if (this.defaultValidationBehavior === null) {
      return () => true
    }
    return this.vbfMap.get(this.defaultValidationBehavior)!
  }
}

export const validationConfig = new ValidationConfig()
