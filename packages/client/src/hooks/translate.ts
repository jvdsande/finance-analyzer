import Strings from 'resources/languages'
import { useEffect, useMemo } from 'react'
import { useLocalStore } from 'mobx-react'

import state from 'state'

const useTranslate = (key: string) => {
  const store = useLocalStore(() => ({
    get language() {
      return state.language
    },
    get Strings() {
      if (state.language) {
        return Strings.get(key)
      }
      return Strings.get(key)
    },
  }))

  useEffect(() => {
    if (store.language) {
      Strings.setLanguage(store.language)
    }
  }, [store.language])

  return useMemo(() => Strings.get(key), [key, store.language])
}

export default useTranslate
