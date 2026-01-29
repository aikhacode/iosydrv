import React from 'react'
import { useLanguage } from './LanguageProvider'
import { t as translate } from '../locales'

export default function withTranslation(Component) {
  const Wrapped = (props) => {
    const { lang, setLang } = useLanguage() || { lang: 'id', setLang: () => {} }
    const t = (key, params = {}) => translate(key, params, lang)
    return <Component {...props} t={t} lang={lang} setLang={setLang} />
  }
  // Preserve display name for easier debugging
  Wrapped.displayName = `withTranslation(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}
