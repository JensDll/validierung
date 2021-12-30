import {
  computed,
  ref,
  watch,
  WatchStopHandle,
  isVue3,
  set,
  Ref,
  ComputedRef
} from 'vue-demi'

import { Form, Validator, ValidatorParameters } from './form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { SimpleRule, RuleInformation, unpackRule } from './rules'
import * as nShared from '@validierung/shared'

type MappedRuleInformation = {
  buffer: nShared.LinkedList<boolean>
  rule?: SimpleRule
  validator: Validator
  validatorNotDebounced: Validator
  validationBehavior: ValidationBehaviorFunction
  cancelDebounce: () => void
}

type DebouncedValidator = nShared.Debounced<ValidatorParameters>

export class FormField {
  watchStopHandle: WatchStopHandle
  form: Form
  ruleInfos: MappedRuleInformation[]
  rulesValidating = ref(0)
  initialModelValue: unknown

  uid: number
  name: string
  touched = ref(false)
  dirty = ref(false)
  modelValue: Ref<any>
  rawErrors: Ref<(string | null)[]>
  errors: ComputedRef<string[]> = computed(() =>
    this.rawErrors.value.filter(nShared.isDefined)
  )
  validating: ComputedRef<boolean> = computed(
    () => this.rulesValidating.value > 0
  )
  hasError: ComputedRef<boolean> = computed(() =>
    this.hasErrors.value.some(value => value)
  )
  hasErrors: Ref<boolean[]>

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
      const rule = unpackRule(info.rule)

      let validator: Validator
      const validatorNotDebounced: Validator = (modelValues, force, submit) => {
        if (rule && this.shouldValidate(ruleNumber, force, submit)) {
          return this.validate(ruleNumber, modelValues)
        }
      }

      let debouncedValidator: DebouncedValidator
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

        validator = (modelValues, force, submit) => {
          if (rule && this.shouldValidate(ruleNumber, force, submit)) {
            debounceInvokedTimes++
            this.rulesValidating.value++
            this.form.rulesValidating.value++

            return new Promise(resolve => {
              debounceResolve?.()
              debounceResolve = resolve
              debouncedValidator(modelValues, force, submit)
            })
          }
        }
      } else {
        validator = validatorNotDebounced
      }

      return {
        buffer: new nShared.LinkedList(),
        rule,
        validator,
        validatorNotDebounced,
        validationBehavior: info.validationBehavior,
        cancelDebounce: () => {
          if (debouncedValidator) {
            debounceInvokedTimes = 0
            debouncedValidator.cancel()
            debounceResolve?.()
          }
        }
      }
    })

    this.watchStopHandle = this.setupWatcher()
  }

  async validate(ruleNumber: number, modelValues: unknown[]) {
    const { rule, buffer } = this.ruleInfos[ruleNumber]

    let error: unknown
    // @ts-expect-error It is made sure that the rule is defined at this point
    const ruleResult = rule(...modelValues)

    if (buffer.last?.value) {
      buffer.last.value = false
      this.rulesValidating.value--
      this.form.rulesValidating.value--
    }

    if (typeof ruleResult?.then === 'function') {
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
        // 1. While this rule was validating the same async rule was invoked again.
        // 2. While this rule was validating the field was reset.
        //
        // In both cases, no error is to be set but the promise should still reject
        // if the rule returns a string.
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
      this.ruleInfos[i].cancelDebounce()
      for (const shouldSetError of this.ruleInfos[i].buffer.nodesForwards()) {
        shouldSetError.value = false
      }
    }

    this.watchStopHandle = this.setupWatcher()
  }

  dispose() {
    if (isVue3) {
      // @ts-ignore Stop is only available in Vue3
      this.errors.effect.stop()
      // @ts-ignore
      this.validating.effect.stop()
      // @ts-ignore
      this.hasError.effect.stop()
    }
    this.watchStopHandle()
  }

  shouldValidate(ruleNumber: number, force: boolean, submit: boolean) {
    return this.ruleInfos[ruleNumber].validationBehavior({
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
