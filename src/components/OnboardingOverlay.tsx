import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '../constants/colors'

const { width } = Dimensions.get('window')
const ONBOARDING_KEY = 'here_onboarding_done'

const PAGES = [
  {
    title: 'Choose your intent',
    body: 'Pick what you want to do — coffee, exercise, co-work, and more.',
  },
  {
    title: 'Turn on your green light',
    body: "Show nearby people you're free. Your exact location stays hidden.",
  },
  {
    title: 'Wave and connect',
    body: 'Wave at someone interesting. If they wave back, you get a 24-hour chat room.',
  },
]

interface Props {
  onDismiss: () => void
}

export function OnboardingOverlay({ onDismiss }: Props) {
  const [page, setPage] = useState(0)

  const handleNext = async () => {
    if (page < PAGES.length - 1) {
      setPage(page + 1)
    } else {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      onDismiss()
    }
  }

  const current = PAGES[page]

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>

        <View style={styles.dots}>
          {PAGES.map((p, i) => (
            <View key={p.title} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{page < PAGES.length - 1 ? 'Next' : "Let's go!"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export async function shouldShowOnboarding(): Promise<boolean> {
  const done = await AsyncStorage.getItem(ONBOARDING_KEY)
  return done !== 'true'
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    width: width - 48,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textMuted },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
})
