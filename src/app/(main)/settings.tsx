import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useStore } from '@nanostores/react'
import { $userProfile } from '../../stores/auth'
import { updateProfile } from '../../services/users'
import { signOut } from '../../services/auth'
import { colors } from '../../constants/colors'

export default function SettingsScreen() {
  const router = useRouter()
  const profile = useStore($userProfile)
  const [name, setName] = useState(profile?.displayName ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      await updateProfile(profile.uid, {
        displayName: name.trim(),
        bio: bio.trim(),
      })
      Alert.alert('Saved', 'Profile updated.')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.replace('/(auth)/phone')
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Text style={styles.avatar}>{profile?.avatar}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(t) => setName(t.slice(0, 20))}
        maxLength={20}
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={(t) => setBio(t.slice(0, 30))}
        maxLength={30}
        placeholder="Describe today in one sentence"
        placeholderTextColor={colors.textMuted}
      />

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  back: { color: colors.primary, fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  avatar: { fontSize: 64, textAlign: 'center', marginBottom: 24 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: { color: colors.text, fontWeight: '600' },
  logoutButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutText: { color: colors.danger, fontWeight: '600' },
})
