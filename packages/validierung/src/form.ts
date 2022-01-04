import { computed, ref, shallowReactive, Ref } from 'vue-demi'

import { FormField, ValidatorReturn } from './formField'
import { ValidationError } from './validationError'
import { RuleInformation, unpackRule } from './rules'

export type SimpleEntry = {
  rollbacks: (() => void)[]
  field: FormField
}

export type KeyedEntry = {
  fields: FormField[]
  modelValues: Ref<unknown>[]
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
      rollbacks: [],
      field
    }
    const keysSeen = new Set<string>()

    ruleInfos.forEach(info => {
      const modelValues = [field.modelValue]
      const key = unpackRule(info.rule)[1]

      if (key) {
        let keyedEntry = this.keyedMap.get(key)!

        if (keyedEntry === undefined) {
          this.keyedMap.set(key, {
            modelValues,
            fields: [field]
          })
        } else if (!keysSeen.has(key)) {
          keyedEntry.modelValues.push(field.modelValue)
          keyedEntry.fields.push(field)
        }

        keyedEntry = this.keyedMap.get(key)!
        keysSeen.add(key)

        const rollback = () => {
          let fieldIndex = -1
          let modelValueIndex = -1

          for (let i = 0; i < keyedEntry.fields.length; ++i) {
            if (keyedEntry.fields[i] === field) {
              fieldIndex = i
            }

            if (keyedEntry.modelValues[i] === field.modelValue) {
              modelValueIndex = i
            }
          }

          if (modelValueIndex >= 0) {
            keyedEntry.modelValues.splice(modelValueIndex, 1)
          }

          if (fieldIndex >= 0) {
            keyedEntry.fields.splice(fieldIndex, 1)
          }

          if (keyedEntry.fields.length === 0) {
            this.keyedMap.delete(key)
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
    const { field } = this.simpleMap.get(uid)!

    return Promise.allSettled<ValidatorReturn>([
      ...field.simpleValidators.map(({ validator }) =>
        validator(field.modelValue, force, false)
      ),
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
      const { fields, modelValues } = this.keyedMap.get(key)!

      if (
        this.isEveryOtherFieldTouched(field, fields) &&
        field.shouldAllValidate(key, force, submit)
      ) {
        for (let i = 0; i < fields.length; ++i) {
          const keyedValidators = fields[i].keyedValidators.get(key)!

          for (let j = 0; j < keyedValidators.length; j++) {
            const { validator, validatorNotDebounced } = keyedValidators[j]

            yield submit
              ? validatorNotDebounced(
                  modelValues,
                  force,
                  submit,
                  fields[i] === field
                )
              : validator(modelValues, force, submit, fields[i] === field)
          }
        }
      }
    }
  }

  private *collectValidatorResultsForNames(
    names?: readonly PropertyKey[]
  ): Iterable<ValidatorReturn> {
    if (names === undefined) {
      for (const { field } of this.simpleMap.values()) {
        field.touched.value = true

        for (let i = 0; i < field.simpleValidators.length; ++i) {
          yield field.simpleValidators[i].validatorNotDebounced(
            field.modelValue,
            false,
            true
          )
        }
      }

      for (const { fields, modelValues } of this.keyedMap.values()) {
        for (let i = 0; i < fields.length; ++i) {
          for (const keyedValidators of fields[i].keyedValidators.values()) {
            for (let j = 0; j < keyedValidators.length; j++) {
              yield keyedValidators[j].validatorNotDebounced(
                modelValues,
                false,
                true
              )
            }
          }
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

      for (const { field } of this.simpleMap.values()) {
        if (uniqueNames.has(field.name)) {
          for (let i = 0; i < field.simpleValidators.length; ++i) {
            yield field.simpleValidators[i].validatorNotDebounced(
              field.modelValue,
              false,
              true
            )
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
