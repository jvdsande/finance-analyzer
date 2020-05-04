import merge from 'lodash/merge'
import LocalizedStrings from 'react-localization'


export function generateLocalizedStrings(languages : any) {
  const ToLocalize : any = {}
  const keys = Object.keys(languages)
  const contents = Object.values(languages)

  keys.forEach((language) => {
    // Make sure the current language is the last to get merged
    const current = contents.shift()
    contents.push(current)
    ToLocalize[language] = merge({}, ...contents)
  })

  // @ts-ignore
  const Strings = new LocalizedStrings(ToLocalize, { logsEnabled: false })

  const getInterfaceLanguage = Strings.getInterfaceLanguage.bind(Strings)
  Strings.getInterfaceLanguage = function () {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('overrideLanguage') || getInterfaceLanguage()
    }

    return ''
  }

  Strings.setLanguage(Strings.getInterfaceLanguage())

  Strings.get = function (value : string) {
    return Strings.getString(value) || value
  }

  Strings.overrideLanguage = function (lang : string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('overrideLanguage', lang)
      window.location.href = window.location.origin + window.location.pathname // Delete hash
    }
  }


  const getLanguage = Strings.getLanguage.bind(Strings)
  Strings.getLanguage = function () {
    const language = getLanguage()

    if (keys.includes(language)) {
      return language
    }

    return 'en'
  }

  return Strings
}

export const other = null
