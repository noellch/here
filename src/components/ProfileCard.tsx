import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { User, IntentTag } from '../types'
import { INTENT_TAG_MAP } from '../constants/intentTags'
import { colors } from '../constants/colors'

interface Props {
  user: User
  intentTag: IntentTag
  onWave: () => void
  onClose: () => void
  waveDisabled: boolean
}

export function ProfileCard({ user, intentTag, onWave, onClose, waveDisabled }: Props) {
  const tag = INTENT_TAG_MAP[intentTag]

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.avatar}>{user.avatar}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {user.displayName}, {user.age}
          </Text>
          <Text style={styles.bio}>{user.bio || 'No bio yet'}</Text>
        </View>
      </View>

      <View style={[styles.tagBadge, { backgroundColor: tag.color + '22' }]}>
        <Text style={styles.tagText}>
          {tag.emoji} {tag.label}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.waveButton, waveDisabled && styles.waveButtonDisabled]}
        onPress={onWave}
        disabled={waveDisabled}
      >
        <Text style={styles.waveText}>Wave</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButton: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  closeText: { color: colors.textMuted, fontSize: 18 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { fontSize: 48 },
  headerInfo: { flex: 1 },
  name: { color: colors.text, fontSize: 18, fontWeight: '600' },
  bio: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tagText: { fontSize: 14 },
  waveButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  waveButtonDisabled: { opacity: 0.4 },
  waveText: { color: colors.text, fontSize: 16, fontWeight: '600' },
})
