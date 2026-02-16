import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useStore } from '@nanostores/react'
import { createUser } from '../../services/users'
import { $authUser, $profileComplete } from '../../stores/auth'
import { colors } from '../../constants/colors'

const EMOJI_AVATARS = ['😊', '😎', '🤗', '🧑‍💻', '🏃', '🎮', '☕', '🎵', '🌟', '🦊', '🐱', '🌸']

export default function ProfileSetupScreen() {
  const authUser = useStore($authUser)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('😊')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return
    }
    const ageNum = parseInt(age, 10)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      Alert.alert('Error', 'Please enter a valid age (18-99)')
      return
    }
    if (!authUser) return

    setLoading(true)
    try {
      await createUser(authUser.uid, {
        phone: authUser.phone,
        displayName: name.trim(),
        avatar,
        age: ageNum,
      })
      $profileComplete.set(true)
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>

      <Text style={styles.label}>Choose an avatar</Text>
      <View style={styles.emojiGrid}>
        {EMOJI_AVATARS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[styles.emojiButton, avatar === emoji && styles.emojiSelected]}
            onPress={() => setAvatar(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(t) => setName(t.slice(0, 20))}
        placeholder="Your name"
        placeholderTextColor={colors.textMuted}
        maxLength={20}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="25"
        placeholderTextColor={colors.textMuted}
        maxLength={2}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Saving...' : "Let's Go"}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 8, marginTop: 16 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSelected: { borderWidth: 2, borderColor: colors.primary },
  emoji: { fontSize: 24 },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
})
