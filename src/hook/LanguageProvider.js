import React, { createContext, useContext, useEffect, useState } from 'react'
import { availableLanguages } from '../locales'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'lang'

const LanguageContext = createContext({ lang: 'id', setLang: () => {} })

export const LanguageProvider = ({ children, defaultLang = 'id' }) => {
  const [lang, setLangState] = useState(defaultLang)

  useEffect(() => {
    // Load persisted language if available
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY)
        if (saved) {
          setLangState(saved)
        }
      } catch (e) {
        // ignore
        console.log('LanguageProvider: failed to load lang', e)
      }
    }
    load()
  }, [])

  const setLang = async (newLang) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLang)
    } catch (e) {
      console.log('LanguageProvider: failed to save lang', e)
    }
    setLangState(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

export default LanguageProvider
