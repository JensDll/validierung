import type { MaybeRef } from '@internal/shared'
import { expectType } from 'tsd'
import type { Ref } from 'vue-demi'

expectType<number | Ref<number>>({} as MaybeRef<number>)

expectType<number | Ref<number>>({} as MaybeRef<Ref<number>>)
