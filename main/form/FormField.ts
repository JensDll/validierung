import { computed, isReactive, isRef, reactive, ref, unref } from 'vue';
import { isArray, isObject, isNotNull } from '../common';
import { jsonCopy } from '../common/json-copy/jsonCopy';
import { Rule } from '../composition/useValidation';

export class FormField {
  private errors: (string | null)[];
  private initialModelValue: any;

  modelValue: ReturnType<typeof ref> | ReturnType<typeof reactive>;
  touched = false;
  validating = ref(false);
  name: string;

  constructor(name: string, modelValue: any, rules: Rule[]) {
    this.name = name;
    this.errors = reactive(rules.map(() => null));
    this.initialModelValue = jsonCopy(unref(modelValue));

    if (isRef(modelValue) || isReactive(modelValue)) {
      this.modelValue = modelValue;
    } else if (isObject(modelValue)) {
      this.modelValue = reactive(modelValue);
      this.initialModelValue = jsonCopy(this.modelValue);
    } else {
      this.modelValue = ref(modelValue);
    }
  }

  setError(ruleNumber: number, error: string | null) {
    this.errors[ruleNumber] = error;
  }

  getErrors() {
    return computed(() => this.errors.filter(isNotNull));
  }

  hasError() {
    return computed(() => this.getErrors().value.length > 0);
  }

  reset(toDefaultValues: boolean) {
    this.touched = false;

    if (toDefaultValues) {
      if (isRef(this.modelValue)) {
        if (isArray(this.modelValue.value)) {
          this.modelValue.value = jsonCopy(this.initialModelValue);
        } else {
          this.modelValue.value = this.initialModelValue;
        }
      } else {
        const copy = jsonCopy(this.initialModelValue);
        Object.assign(this.modelValue, copy);
      }
    }

    Object.assign(
      this.errors,
      this.errors.map(() => null)
    );
  }
}
