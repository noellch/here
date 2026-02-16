import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Wave, User } from '../types'
import { INTENT_TAG_MAP } from '../constants/intentTags'
import { colors } from '../constants/colors'

interface Props {
  wave: Wave
  otherUser: User | null
  isIncoming: boolean
  onAccept?: () => void
  onOpenChat?: () => void
}

export function WaveCard({ wave, otherUser, isIncoming, onAccept, onOpenChat }: Props) {
  const tag = INTENT_TAG_MAP[wave.intentTag]
  const isExpired = wave.status === 'expired'
  const isAccepted = wave.status === 'accepted'

  return (
    <View style={[styles.card, isExpired && styles.cardExpired]}>
      <View style={styles.row}>
        <Text style={styles.avatar}>{otherUser?.avatar ?? '?'}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{otherUser?.displayName ?? 'Unknown'}</Text>
          <Text style={styles.tag}>
            {tag.emoji} {tag.label}
          </Text>
          <Text style={styles.icebreaker}>{wave.icebreaker}</Text>
        </View>
      </View>

      {isIncoming && wave.status === 'pending' && onAccept && (
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      )}

      {isAccepted && onOpenChat && (
        <TouchableOpacity style={styles.chatButton} onPress={onOpenChat}>
          <Text style={styles.chatText}>Open Chat</Text>
        </TouchableOpacity>
      )}

      {isExpired && <Text style={styles.expiredText}>Expired</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardExpired: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { fontSize: 36 },
  info: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  tag: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  icebreaker: { color: colors.textMuted, fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  acceptButton: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  acceptText: { color: '#FFF', fontWeight: '600' },
  chatButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  chatText: { color: '#FFF', fontWeight: '600' },
  expiredText: { color: colors.textMuted, textAlign: 'center', marginTop: 12, fontSize: 13 },
})
