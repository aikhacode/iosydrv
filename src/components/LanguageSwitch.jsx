import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Modal, Animated, Pressable } from 'react-native'
import { useLanguage } from '../hook/LanguageProvider'
import * as colors from '../assets/css/Colors'

const LABELS = {
  id: 'Bahasa',
  en: 'English',
  ar: 'العربية',
  zh: '中文',
}

const LanguageSwitch = () => {
  const { lang, setLang, availableLanguages } = useLanguage() || { lang: 'id', setLang: () => {}, availableLanguages: ['id','en'] }
  const [visible, setVisible] = useState(false)
  const transY = useRef(new Animated.Value(250)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(transY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(transY, {
        toValue: 250,
        duration: 180,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, transY])

  const open = () => setVisible(true)
  const close = () => setVisible(false)

  const onSelect = (code) => {
    setLang(code)
    close()
  }

  return (
    <View style={styles.root} pointerEvents="box-none">
      <TouchableOpacity style={styles.trigger} onPress={open} accessibilityLabel="open-language-switch">
        <Text style={styles.triggerText}>{LABELS[lang] || lang}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: transY }] }]}>
          <View style={styles.handle} />
          {availableLanguages.map((code) => {
            const active = code === lang
            return (
              <TouchableOpacity key={code} style={[styles.row, active ? styles.rowActive : null]} onPress={() => onSelect(code)}>
                <Text style={[styles.rowLabel, active ? styles.rowLabelActive : null]}>{LABELS[code] || code}</Text>
                {active && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            )
          })}
        </Animated.View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 40,
    right: 12,
    zIndex: 20,
  },
  trigger: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
  triggerText: {
    color: '#fff',
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 8,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowActive: {
    backgroundColor: '#f2f2f2'
  },
  rowLabel: {
    fontSize: 16,
    color: '#222'
  },
  rowLabelActive: {
    fontWeight: '600'
  },
  check: {
    fontSize: 16,
    color: colors.theme_bg || '#007aff'
  }
})

export default LanguageSwitch
