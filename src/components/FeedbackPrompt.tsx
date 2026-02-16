import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FeedbackRating } from '../types'
import { submitFeedback } from '../services/reports'
import { colors } from '../constants/colors'

interface Props {
  userId: string
  chatRoomId: string
  onDone: () => void
}

const RATINGS: { key: FeedbackRating; emoji: string; label: string }[] = [
  { key: 'good', emoji: ':)', label: 'Great' },
  { key: 'okay', emoji: ':|', label: 'Okay' },
  { key: 'bad', emoji: ':(', label: 'Not good' },
]

export function FeedbackPrompt({ userId, chatRoomId, onDone }: Props) {
  const handleRate = async (rating: FeedbackRating) => {
    await submitFeedback({ userId, chatRoomId, rating })
    onDone()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How was your meetup?</Text>
      <View style={styles.options}>
        {RATINGS.map((r) => (
          <TouchableOpacity key={r.key} style={styles.option} onPress={() => handleRate(r.key)}>
            <Text style={styles.emoji}>{r.emoji}</Text>
            <Text style={styles.label}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 16 },
  options: { flexDirection: 'row', gap: 16 },
  option: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minWidth: 80,
  },
  emoji: { fontSize: 32, marginBottom: 4 },
  label: { color: colors.textSecondary, fontSize: 13 },
})
