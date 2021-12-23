import { Plugin } from 'vue-demi'

import { validationConfig } from './validationConfig'
import {
  ValidationBehaviorFunction,
  ValidationBehaviorString
} from './validationBehavior'

type Configuration = {
  defaultValidationBehavior: ValidationBehaviorString
  validationBehavior: {
    [K in ValidationBehaviorString]: ValidationBehaviorFunction
  }
}

/**
 * Configure the validation behavior of `useValidation`.
 *
 * @param configuration - The form validation configuration
 */
export function createValidation(configuration: Configuration): Plugin {
  return {
    install() {
      for (const [key, validationBehavior] of Object.entries(
        configuration.validationBehavior ?? {}
      ) as [ValidationBehaviorString, ValidationBehaviorFunction][]) {
        validationConfig.validationBehavior.set(key, validationBehavior)
      }

      if (
        validationConfig.validationBehavior.has(
          configuration.defaultValidationBehavior
        )
      ) {
        validationConfig.defaultValidationBehavior =
          configuration.defaultValidationBehavior
      } else {
        console.warn(
          `[useValidation] Default validation behavior '${configuration.defaultValidationBehavior}' is not valid. Valid values are`,
          validationConfig.validationBehavior.keys()
        )
      }
    }
  }
}