import { expectType } from 'tsd'
import { Ref } from 'vue-demi'

import { MaybeRef } from '@compose-validation/shared'

expectType<number | Ref<number>>({} as MaybeRef<number>)

expectType<number | Ref<number>>({} as MaybeRef<Ref<number>>)
