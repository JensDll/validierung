import { expectType } from 'tsd'
import type { Ref } from 'vue-demi'

import type { MaybeRef } from '@internal/shared'

expectType<number | Ref<number>>({} as MaybeRef<number>)

expectType<number | Ref<number>>({} as MaybeRef<Ref<number>>)
