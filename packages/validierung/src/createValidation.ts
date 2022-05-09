import { validationConfig } from './validationConfig'
import type {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './validationBehavior'

type Configuration = {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: {
    [K in ValidationBehaviorString]: ValidationBehaviorFunction
  }
}

export type Validation = {
  install(): void
}

/**
 * Configure the validation behavior of `useValidation`.
 *
 * @param configuration - The form validation configuration
 */
export function createValidation(configuration: Configuration): Validation {
  return {
    install() {
      for (const [key, validationBehavior] of Object.entries(
        configuration.validationBehavior ?? {}
      ) as [ValidationBehaviorString, ValidationBehaviorFunction][]) {
        validationConfig.vbfMap.set(key, validationBehavior)
      }

      if (
        validationConfig.vbfMap.has(configuration.defaultValidationBehavior)
      ) {
        validationConfig.defaultValidationBehavior =
          configuration.defaultValidationBehavior
      } else if (__DEV__) {
        console.warn(
          `[validierung] Default validation behavior '${
            configuration.defaultValidationBehavior
          }' is not valid. Valid values are: "${[
            ...validationConfig.vbfMap.keys()
          ].join(', ')}"`
        )
      }
    }
  }
}
