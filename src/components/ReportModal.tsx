import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { ReportCategory } from '../types'
import { submitReport } from '../services/reports'
import { blockUser } from '../services/users'
import { colors } from '../constants/colors'

const CATEGORIES: { key: ReportCategory; label: string }[] = [
  { key: 'harassment', label: 'Harassment' },
  { key: 'inappropriate', label: 'Inappropriate language' },
  { key: 'fake', label: 'Fake account' },
  { key: 'bad_behavior', label: 'Bad in-person behavior' },
]

interface Props {
  visible: boolean
  reporterId: string
  reportedUserId: string
  chatRoomId?: string
  onClose: () => void
}

export function ReportModal({ visible, reporterId, reportedUserId, chatRoomId, onClose }: Props) {
  const handleReport = async (category: ReportCategory) => {
    await submitReport({ reporterId, reportedUserId, category, chatRoomId })
    await blockUser(reporterId, reportedUserId)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Report User</Text>
          <Text style={styles.subtitle}>This will also block them immediately.</Text>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.option}
              onPress={() => handleReport(cat.key)}
            >
              <Text style={styles.optionText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: colors.textMuted, fontSize: 13, marginBottom: 16 },
  option: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    marginBottom: 8,
  },
  optionText: { color: colors.text, fontSize: 15 },
  cancel: { padding: 14, alignItems: 'center', marginTop: 8 },
  cancelText: { color: colors.textMuted, fontSize: 15 },
})
