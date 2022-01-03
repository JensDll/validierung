import { computed, ref, shallowReactive, Ref } from 'vue-demi'

import { FormField } from './formField'
import { ValidationError } from './validationError'
import { isSimpleRule, RuleInformation } from './rules'

export type ValidatorReturn = Promise<void> | void
export type Validator = (
  modelValues: Ref<unknown>[]
) => (force: boolean, submit: boolean) => ValidatorReturn

export type ValidatorTuple = {
  validator: ReturnType<Validator>
  validatorNotDebounced: ReturnType<Validator>
}

export type SimpleEntry = {
  validators: ValidatorTuple[]
  rollbacks: (() => void)[]
  field: FormField
}

export type KeyedEntry = {
  validators: ValidatorTuple[]
  modelValues: Ref<unknown>[]
  fields: FormField[]
}

export class Form {
  simpleMap: Map<number, SimpleEntry> = new Map()
  keyedMap: Map<string, KeyedEntry> = new Map()

  reactiveFieldMap: Map<number, FormField> = shallowReactive(new Map())

  rulesValidating = ref(0)
  submitting = ref(false)
  validating = computed(() => this.rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)
  errors = computed(() => {
    const errors: string[] = []

    for (const field of this.reactiveFieldMap.values()) {
      errors.push(...field.errors.value)
    }

    return errors
  })

  registerField(
    uid: number,
    name: string,
    modelValue: unknown,
    ruleInfos: RuleInformation[]
  ) {
    const field = new FormField(this, uid, name, modelValue, ruleInfos)
    const simpleEntry: SimpleEntry = {
      validators: [],
      rollbacks: [],
      field
    }
    const keysSeen = new Set<string>()

    ruleInfos.forEach(({ rule }, ruleNumber) => {
      const modelValues = [field.modelValue]
      const validatorTuple: ValidatorTuple = {
        validator: field.ruleInfos[ruleNumber].validator(modelValues),
        validatorNotDebounced:
          field.ruleInfos[ruleNumber].validatorNotDebounced(modelValues)
      }

      if (isSimpleRule(rule)) {
        simpleEntry.validators.push(validatorTuple)
      } else {
        let keyedEntry = this.keyedMap.get(rule.key)!

        if (keyedEntry === undefined) {
          this.keyedMap.set(rule.key, {
            validators: [validatorTuple],
            modelValues,
            fields: [field]
          })
        } else {
          keyedEntry.validators.push(validatorTuple)
          if (!keysSeen.has(rule.key)) {
            keyedEntry.modelValues.push(field.modelValue)
            keyedEntry.fields.push(field)
          }
        }

        keyedEntry = this.keyedMap.get(rule.key)!

        validatorTuple.validator = field.ruleInfos[ruleNumber].validator(
          keyedEntry.modelValues
        )
        validatorTuple.validatorNotDebounced = field.ruleInfos[
          ruleNumber
        ].validatorNotDebounced(keyedEntry.modelValues)

        keysSeen.add(rule.key)

        const rollback = () => {
          let validatorIndex = -1
          let modelValueIndex = -1
          let fieldIndex = -1

          for (let i = 0; i < keyedEntry.validators.length; ++i) {
            if (keyedEntry.validators[i] === validatorTuple) {
              validatorIndex = i
            }

            if (keyedEntry.modelValues[i] === field.modelValue) {
              modelValueIndex = i
            }

            if (keyedEntry.fields[i] === field) {
              fieldIndex = i
            }
          }

          if (validatorIndex >= 0) {
            keyedEntry.validators.splice(validatorIndex, 1)
          }

          if (modelValueIndex >= 0) {
            keyedEntry.modelValues.splice(modelValueIndex, 1)
          }

          if (fieldIndex >= 0) {
            keyedEntry.fields.splice(fieldIndex, 1)
          }

          if (keyedEntry.validators.length === 0) {
            this.keyedMap.delete(rule.key)
          }
        }

        simpleEntry.rollbacks.push(rollback)
      }
    })

    this.simpleMap.set(uid, simpleEntry)
    this.reactiveFieldMap.set(uid, field)

    return field
  }

  validate(uid: number, force = false): Promise<PromiseSettledResult<void>[]> {
    const { validators, field } = this.simpleMap.get(uid)!

    return Promise.allSettled<ValidatorReturn>([
      ...validators.map(({ validator }) => validator(force, false)),
      ...this.collectValidatorResultsForKeys(field.keys, field, force, false)
    ])
  }

  async validateAll(names?: readonly PropertyKey[]): Promise<void> {
    const settledResults = await Promise.allSettled<ValidatorReturn>(
      this.collectValidatorResultsForNames(names)
    )

    for (const result of settledResults) {
      if (result.status === 'rejected') {
        throw new ValidationError()
      }
    }
  }

  dispose(uid: number): void {
    const simpleEntry = this.simpleMap.get(uid)

    if (simpleEntry) {
      simpleEntry.field.dispose()
      simpleEntry.rollbacks.forEach(r => r())
    }

    this.simpleMap.delete(uid)
    this.reactiveFieldMap.delete(uid)
  }

  resetFields(): void {
    for (const { field } of this.simpleMap.values()) {
      field.reset()
    }
  }

  getField(uid: number): FormField | undefined {
    const simpleEntry = this.simpleMap.get(uid)
    if (simpleEntry) {
      return simpleEntry.field
    }
  }

  private *collectValidatorResultsForKeys(
    keys: Iterable<string>,
    field: FormField,
    force: boolean,
    submit: boolean
  ): Iterable<ValidatorReturn> {
    for (const key of keys) {
      const { validators, fields } = this.keyedMap.get(key)!

      if (this.isEveryOtherFieldTouched(field, fields)) {
        for (let i = 0; i < validators.length; ++i) {
          yield submit
            ? validators[i].validatorNotDebounced(force, submit)
            : validators[i].validator(force, submit)
        }
      }
    }
  }

  private *collectValidatorResultsForNames(
    names?: readonly PropertyKey[]
  ): Iterable<ValidatorReturn> {
    if (names === undefined) {
      for (const { field, validators } of this.simpleMap.values()) {
        field.touched.value = true

        for (let i = 0; i < validators.length; ++i) {
          yield validators[i].validatorNotDebounced(false, true)
        }
      }

      for (const key of this.keyedMap.keys()) {
        const { validators } = this.keyedMap.get(key)!

        for (let i = 0; i < validators.length; ++i) {
          yield validators[i].validatorNotDebounced(false, true)
        }
      }
    } else if (names.length > 0) {
      const uniqueNames = new Set(names)
      const validatedKeys = new Set<string>()

      for (const { field } of this.simpleMap.values()) {
        if (uniqueNames.has(field.name)) {
          field.touched.value = true
        }
      }

      for (const { field, validators } of this.simpleMap.values()) {
        if (uniqueNames.has(field.name)) {
          for (let i = 0; i < validators.length; ++i) {
            yield validators[i].validatorNotDebounced(false, true)
          }

          for (const key of field.keys) {
            if (!validatedKeys.has(key)) {
              validatedKeys.add(key)
              yield* this.collectValidatorResultsForKeys(
                [key],
                field,
                false,
                true
              )
            }
          }
        }
      }
    }
  }

  private isEveryOtherFieldTouched(
    field: FormField,
    fields: FormField[]
  ): boolean {
    for (let i = 0; i < fields.length; ++i) {
      if (field !== fields[i] && !fields[i].touched.value) {
        return false
      }
    }

    return true
  }
}
