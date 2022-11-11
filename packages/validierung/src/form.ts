import {
  computed,
  del,
  isVue3,
  ref,
  set,
  shallowReactive,
  type ComputedRef,
  type Ref
} from 'vue-demi'

import { FormField, type ValidatorReturn } from '~validierung/formField'
import { unpackRule, type RuleInformation } from '~validierung/rules'
import { ValidationError } from '~validierung/validationError'

export type SimpleEntry = {
  field: FormField
  rollbacks: (() => void)[]
}

export type KeyedEntry = {
  fields: FormField[]
  modelValues: Ref<unknown>[]
}

export class Form {
  simpleMap: Map<number, SimpleEntry> = new Map()
  keyedMap: Map<string, KeyedEntry> = new Map()

  reactiveErrors: Record<number, ComputedRef<string[]>> = shallowReactive({})

  rulesValidating = ref(0)
  submitting = ref(false)
  validating = computed(() => this.rulesValidating.value > 0)
  hasError = computed(() => this.errors.value.length > 0)
  errors = computed(() =>
    Object.values(this.reactiveErrors).flatMap(e => e.value)
  )

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

    for (let i = 0; i < ruleInfos.length; ++i) {
      const key = unpackRule(ruleInfos[i].rule)[1]

      if (key === undefined) {
        continue
      }

      let keyedEntry = this.keyedMap.get(key)!

      if (keyedEntry === undefined) {
        this.keyedMap.set(key, {
          fields: [field],
          modelValues: [field.modelValue]
        })
      } else if (!keysSeen.has(key)) {
        keyedEntry.fields.push(field)
        keyedEntry.modelValues.push(field.modelValue)
      }

      keyedEntry = this.keyedMap.get(key)!
      keysSeen.add(key)

      const rollback = () => {
        for (let i = 0; i < keyedEntry.fields.length; ++i) {
          if (keyedEntry.fields[i] === field) {
            keyedEntry.fields.splice(i, 1)
            keyedEntry.modelValues.splice(i, 1)
            break
          }
        }

        if (keyedEntry.fields.length === 0) {
          this.keyedMap.delete(key)
        }
      }

      simpleEntry.rollbacks.push(rollback)
    }

    this.simpleMap.set(uid, simpleEntry)
    isVue3
      ? (this.reactiveErrors[uid] = field.errors)
      : set(this.reactiveErrors, uid, field.errors)

    return field
  }

  validate(uid: number, force = false): Promise<PromiseSettledResult<void>[]> {
    const { field } = this.simpleMap.get(uid)!

    return Promise.allSettled<ValidatorReturn>([
      ...field.simpleValidators.map(({ validator }) => validator(force, false)),
      ...this.collectValidatorResultsForKeys(field, force, false)
    ])
  }

  async validateAll(names?: readonly PropertyKey[]): Promise<void> {
    const settledResults = await Promise.allSettled<ValidatorReturn>(
      this.collectValidatorResultsForNames(names)
    )

    for (let i = 0; i < settledResults.length; ++i) {
      if (settledResults[i].status === 'rejected') {
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
    isVue3 ? delete this.reactiveErrors[uid] : del(this.reactiveErrors, uid)
  }

  resetFields(): void {
    for (const { field } of this.simpleMap.values()) {
      field.reset()
    }
  }

  getField(uid: number): FormField | undefined {
    const simpleEntry = this.simpleMap.get(uid)
    return simpleEntry?.field
  }

  private *collectValidatorResultsForKeys(
    field: FormField,
    force: boolean,
    submit: boolean,
    keys: Iterable<string> = field.keyedValidators.keys()
  ): Iterable<ValidatorReturn> {
    for (const key of keys) {
      const { fields, modelValues } = this.keyedMap.get(key)!

      const isEveryOtherFieldTouchedAndShouldValidate =
        this.isEveryOtherFieldTouched(field, fields) &&
        field.shouldValidateForKey(key, force, submit)

      if (!isEveryOtherFieldTouchedAndShouldValidate) {
        return
      }

      for (let fieldIdx = 0; fieldIdx < fields.length; ++fieldIdx) {
        const keyedValidators = fields[fieldIdx].keyedValidators.get(key)!

        for (
          let keyedValidatorIdx = 0;
          keyedValidatorIdx < keyedValidators.length;
          ++keyedValidatorIdx
        ) {
          yield submit
            ? keyedValidators[keyedValidatorIdx].validatorNotDebounced(
                force,
                submit,
                modelValues,
                fields[keyedValidatorIdx] === field
              )
            : keyedValidators[keyedValidatorIdx].validator(
                force,
                submit,
                modelValues,
                fields[keyedValidatorIdx] === field
              )
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
          yield field.simpleValidators[i].validatorNotDebounced(false, true)
        }
      }

      for (const [key, { fields, modelValues }] of this.keyedMap.entries()) {
        for (let fieldIdx = 0; fieldIdx < fields.length; ++fieldIdx) {
          const keyedValidators = fields[fieldIdx].keyedValidators.get(key)!

          for (
            let keyedValidatorIdx = 0;
            keyedValidatorIdx < keyedValidators.length;
            ++keyedValidatorIdx
          ) {
            yield keyedValidators[keyedValidatorIdx].validatorNotDebounced(
              false,
              true,
              modelValues
            )
          }
        }
      }

      return
    }

    if (names.length === 0) {
      return
    }

    const uniqueNames = new Set(names)
    const validatedKeys = new Set<string>()

    for (const { field } of this.simpleMap.values()) {
      if (uniqueNames.has(field.name)) {
        field.touched.value = true
      }
    }

    for (const { field } of this.simpleMap.values()) {
      if (!uniqueNames.has(field.name)) {
        continue
      }

      for (let i = 0; i < field.simpleValidators.length; ++i) {
        yield field.simpleValidators[i].validatorNotDebounced(false, true)
      }

      for (const key of field.keyedValidators.keys()) {
        if (validatedKeys.has(key)) {
          continue
        }

        validatedKeys.add(key)
        yield* this.collectValidatorResultsForKeys(field, false, true, [key])
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
