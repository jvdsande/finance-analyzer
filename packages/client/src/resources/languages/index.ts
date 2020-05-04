import { generateLocalizedStrings } from 'utils/strings'

import en from 'resources/languages/en.yaml'
import fr from 'resources/languages/fr.yaml'

const Strings = generateLocalizedStrings({
  en, fr,
})

Strings.autoDetect = function (props) {
  if (props.pageContext.autoLanguage) {
    Strings.setLanguage(props.pageContext.language)
  }
}

export default Strings
