import {
  computed,
  ref,
  watch,
  WatchStopHandle,
  isVue3,
  set,
  Ref,
  ComputedRef,
  isRef
} from 'vue-demi'

import { Form } from './form'
import { ValidationBehaviorFunction } from './validationBehavior'
import { SimpleRule, RuleInformation, unpackRule } from './rules'
import * as nShared from '@validierung/shared'

export type ValidatorReturn = Promise<void> | void
export type Validator = (
  modelValues: Ref<unknown> | Ref<unknown>[],
  force: boolean,
  submit: boolean,
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
  initialModelValue: unknown
  modelValue: Ref<unknown>

  rulesValidating = ref(0)
  validating: ComputedRef<boolean> = computed(
    () => this.rulesValidating.value > 0
  )

  rawErrors: Ref<(string | null)[]>
  errors: ComputedRef<string[]> = computed(() =>
    this.rawErrors.value.filter(nShared.isDefined)
  )

  hasErrors: Ref<boolean[]>
  hasError: ComputedRef<boolean> = computed(() =>
    this.hasErrors.value.some(e => e)
  )

  form: Form
  keys: Set<string> = new Set()
  simpleValidators: ValidatorTuple[] = []
  keyedValidators: Record<string, ValidatorTuple[]> = {}
  ruleInfos: MappedRuleInformation[]
  watchStopHandle: WatchStopHandle

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

      let validator: Validator
      const validatorNotDebounced: Validator = (
        modelValues,
        force,
        submit,
        skipShouldValidate = false
      ) => {
        if (
          rule &&
          (skipShouldValidate || this.shouldValidate(ruleNumber, force, submit))
        ) {
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

        validator = (
          modelValues,
          force,
          submit,
          skipShouldValidate = false
        ) => {
          if (
            rule &&
            (skipShouldValidate ||
              this.shouldValidate(ruleNumber, force, submit))
          ) {
            debounceInvokedTimes++
            this.rulesValidating.value++
            this.form.rulesValidating.value++

            return new Promise(resolve => {
              debounceResolve?.()
              debounceResolve = resolve
              debouncedValidator(modelValues)
            })
          }
        }
      } else {
        validator = validatorNotDebounced
      }

      const validatorTuple: ValidatorTuple = {
        ruleNumber,
        validator,
        validatorNotDebounced
      }

      if (key) {
        this.keys.add(key)

        const keyedValidators = this.keyedValidators[key]

        if (keyedValidators === undefined) {
          this.keyedValidators[key] = rule ? [validatorTuple] : []
        } else {
          rule && keyedValidators.push(validatorTuple)
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

  async validate(
    ruleNumber: number,
    modelValues: Ref<unknown> | Ref<unknown>[]
  ) {
    const { rule, buffer } = this.ruleInfos[ruleNumber]

    let error: unknown
    // It is made sure that the rule is defined at this point
    const ruleResult = isRef(modelValues)
      ? rule!(modelValues.value)
      : rule!(...modelValues.map(r => r.value))

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
      this.ruleInfos[i].cancelDebounce()
      for (const shouldSetError of this.ruleInfos[i].buffer.nodesForwards()) {
        shouldSetError.value = false
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

  shouldAllValidate(key: string, force: boolean, submit: boolean): boolean {
    for (let i = 0; i < this.keyedValidators[key].length; i++) {
      const shouldValidateResult = this.shouldValidate(
        this.keyedValidators[key][i].ruleNumber,
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
    return this.ruleInfos[ruleNumber].vbf({
      hasError: this.hasErrors.value[ruleNumber],
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
