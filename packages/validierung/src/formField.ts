import {
  computed,
  ref,
  watch,
  isVue3,
  set,
  isRef,
  type WatchStopHandle,
  type Ref,
  type ComputedRef
} from 'vue-demi'

import type { Form } from './form'
import type { ValidationBehaviorFunction } from './validationBehavior'
import { unpackRule, type SimpleRule, type RuleInformation } from './rules'
import * as nShared from '@internal/shared'

export type ValidatorReturn = Promise<void> | void
export type Validator = (
  force: boolean,
  submit: boolean,
  modelValues?: Ref<unknown> | Ref<unknown>[],
  skipShouldValidate?: boolean
) => ValidatorReturn

export type ValidatorTuple = {
  ruleNumber: number
  validator: Validator
  validatorNotDebounced: Validator
}

type MappedRuleInformation = {
  buffer: nShared.LinkedList<boolean>
  rule?: SimpleRule
  validator: Validator
  validatorNotDebounced: Validator
  vbf: ValidationBehaviorFunction
  cancelDebounce: () => void
}

type DebouncedValidator = nShared.Debounced<[Ref<unknown> | Ref<unknown>[]]>

export class FormField {
  uid: number
  name: string
  touched: Ref<boolean> = ref(false)
  dirty: Ref<boolean> = ref(false)
  private initialModelValue: unknown
  modelValue: Ref<unknown>

  private rulesValidating = ref(0)
  validating: ComputedRef<boolean> = computed(
    () => this.rulesValidating.value > 0
  )

  private rawErrors: Ref<(string | null)[]>
  errors: ComputedRef<string[]> = computed(() =>
    this.rawErrors.value.filter(nShared.isDefined)
  )

  private hasErrors: Ref<boolean[]>
  hasError: ComputedRef<boolean> = computed(() =>
    this.hasErrors.value.some(e => e)
  )

  private form: Form
  simpleValidators: ValidatorTuple[] = []
  keyedValidators: Map<string, ValidatorTuple[]> = new Map()
  private ruleInfos: (MappedRuleInformation | undefined)[]
  private watchStopHandle: WatchStopHandle

  constructor(
    form: Form,
    uid: number,
    name: string,
    modelValue: unknown,
    ruleInfos: RuleInformation[]
  ) {
    this.form = form
    this.uid = uid
    this.name = name
    this.modelValue = ref(modelValue)
    this.rawErrors = ref(ruleInfos.map(() => null))
    this.hasErrors = ref(ruleInfos.map(() => false))
    this.initialModelValue = nShared.deepCopy(this.modelValue.value)

    this.ruleInfos = ruleInfos.map((info, ruleNumber) => {
      const [rule, key] = unpackRule(info.rule)

      if (!rule) {
        if (key && this.keyedValidators.get(key) === undefined) {
          this.keyedValidators.set(key, [])
        }

        return
      }

      let validator: Validator
      let validatorNotDebounced: Validator

      validator = validatorNotDebounced = (
        force,
        submit,
        modelValues = this.modelValue,
        skipShouldValidate = false
      ) => {
        if (
          skipShouldValidate ||
          this.shouldValidate(ruleNumber, force, submit)
        ) {
          return this.validate(ruleNumber, modelValues)
        }
      }

      let debouncedValidator: DebouncedValidator | undefined = undefined
      let debounceInvokedTimes = 0
      let debounceResolve: (value: void | PromiseLike<void>) => void

      if (info.debounce) {
        debouncedValidator = nShared.debounce(
          modelValues => {
            debounceResolve(this.validate(ruleNumber, modelValues))
            this.rulesValidating.value -= debounceInvokedTimes
            this.form.rulesValidating.value -= debounceInvokedTimes
            debounceInvokedTimes = 0
          },
          {
            wait: info.debounce
          }
        )

        validator = (
          force,
          submit,
          modelValues = this.modelValue,
          skipShouldValidate = false
        ) => {
          if (
            skipShouldValidate ||
            this.shouldValidate(ruleNumber, force, submit)
          ) {
            debounceInvokedTimes++
            this.rulesValidating.value++
            this.form.rulesValidating.value++

            return new Promise(resolve => {
              debounceResolve?.()
              debounceResolve = resolve
              debouncedValidator!(modelValues)
            })
          }
        }
      }

      const validatorTuple: ValidatorTuple = {
        ruleNumber,
        validator,
        validatorNotDebounced
      }

      if (key) {
        const keyedValidators = this.keyedValidators.get(key)

        if (keyedValidators === undefined) {
          this.keyedValidators.set(key, [validatorTuple])
        } else {
          keyedValidators.push(validatorTuple)
        }
      } else {
        this.simpleValidators.push(validatorTuple)
      }

      return {
        buffer: new nShared.LinkedList(),
        rule,
        validator,
        validatorNotDebounced,
        vbf: info.vbf,
        cancelDebounce: !debouncedValidator
          ? () => {}
          : () => {
              debounceInvokedTimes = 0
              debouncedValidator!.cancel()
              debounceResolve?.()
            }
      }
    })

    this.watchStopHandle = this.setupWatcher()
  }

  async validate(
    ruleNumber: number,
    modelValues: Ref<unknown> | Ref<unknown>[]
  ) {
    const { rule, buffer } = this.ruleInfos[ruleNumber]!

    let error: unknown
    const ruleResult = isRef(modelValues)
      ? rule!(modelValues.value)
      : rule!(...modelValues.map(r => r.value))

    if (buffer.last?.value) {
      buffer.last.value = false
      this.rulesValidating.value--
      this.form.rulesValidating.value--
    }

    if (nShared.isPromise(ruleResult)) {
      const shouldSetError = buffer.addLast(true)

      this.rulesValidating.value++
      this.form.rulesValidating.value++

      try {
        error = await ruleResult
      } catch (err) {
        error = err
      }

      buffer.remove(shouldSetError)

      if (shouldSetError.value) {
        this.rulesValidating.value--
        this.form.rulesValidating.value--
        this.setError(ruleNumber, error)
      } else {
        // This branch is reached in one of two cases:
        // 1. While this rule is validating, the same async rule was invoked again.
        // 2. While this rule is validating, the field was reset.
        //
        // In both cases, no error is to be set, but the promise should still reject
        // if the rule returns a string or symbol.
        if (typeof error === 'string' || typeof error === 'symbol') {
          throw error
        }
      }
    } else {
      error = ruleResult
      this.setError(ruleNumber, error)
    }
  }

  reset(resetValue = this.initialModelValue) {
    this.watchStopHandle()
    this.touched.value = false
    this.dirty.value = false
    this.modelValue.value = nShared.deepCopy(resetValue)
    this.rulesValidating.value = 0
    this.form.rulesValidating.value = 0

    for (let i = 0; i < this.ruleInfos.length; ++i) {
      if (isVue3) {
        this.rawErrors.value[i] = null
        this.hasErrors.value[i] = false
      } else {
        set(this.rawErrors.value, i, null)
        set(this.hasErrors.value, i, false)
      }

      const ruleInfos = this.ruleInfos[i]

      if (ruleInfos) {
        ruleInfos.cancelDebounce()
        for (const shouldSetError of ruleInfos.buffer) {
          shouldSetError.value = false
        }
      }
    }

    this.watchStopHandle = this.setupWatcher()
  }

  dispose() {
    if (isVue3) {
      // @ts-ignore Stop is only available in Vue 3
      this.errors.effect.stop()
      // @ts-ignore
      this.validating.effect.stop()
      // @ts-ignore
      this.hasError.effect.stop()
    }
    this.watchStopHandle()
  }

  shouldValidateForKey(key: string, force: boolean, submit: boolean): boolean {
    const keyedValidators = this.keyedValidators.get(key)!

    for (let i = 0; i < keyedValidators.length; ++i) {
      const shouldValidateResult = this.shouldValidate(
        keyedValidators[i].ruleNumber,
        force,
        submit
      )

      if (!shouldValidateResult) {
        return false
      }
    }

    return true
  }

  private shouldValidate(ruleNumber: number, force: boolean, submit: boolean) {
    return this.ruleInfos[ruleNumber]!.vbf({
      hasError: this.rawErrors.value[ruleNumber] !== null,
      touched: this.touched.value,
      dirty: this.dirty.value,
      force,
      submit,
      value: this.modelValue.value
    })
  }

  private setError(ruleNumber: any, error: unknown) {
    const isString = typeof error === 'string'
    const isSymbol = typeof error === 'symbol'

    if (isString || isSymbol) {
      if (isVue3) {
        isString && (this.rawErrors.value[ruleNumber] = error)
        this.hasErrors.value[ruleNumber] = true
      } else {
        isString && set(this.rawErrors.value, ruleNumber, error)
        set(this.hasErrors.value, ruleNumber, true)
      }
      throw error
    }

    if (isVue3) {
      this.rawErrors.value[ruleNumber] = null
      this.hasErrors.value[ruleNumber] = false
    } else {
      set(this.rawErrors.value, ruleNumber, null)
      set(this.hasErrors.value, ruleNumber, false)
    }
  }

  private setupWatcher() {
    return watch(
      this.modelValue,
      () => {
        this.dirty.value = true
        this.form.validate(this.uid)
      },
      { deep: true }
    )
  }
}
