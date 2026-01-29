import React, { createContext, useContext, useState } from 'react'
import { availableLanguages } from '../locales'

const LanguageContext = createContext({ lang: 'id', setLang: () => {} })

export const LanguageProvider = ({ children, defaultLang = 'id' }) => {
  const [lang, setLang] = useState(defaultLang)
  return (
    <LanguageContext.Provider value={{ lang, setLang, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

export default LanguageProvider
