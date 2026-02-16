import { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useStore } from '@nanostores/react'
import { useChat } from '../../hooks/useChat'
import { sendMessage, getChatRoomByWaveId } from '../../services/chat'
import { $currentMessages } from '../../stores/chat'
import { $authUser } from '../../stores/auth'
import { ChatRoom, ChatMessage } from '../../types'
import { colors } from '../../constants/colors'

export default function ChatScreen() {
  const { waveId } = useLocalSearchParams<{ waveId: string }>()
  const router = useRouter()
  const authUser = useStore($authUser)
  const messages = useStore($currentMessages)
  const [text, setText] = useState('')
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const flatListRef = useRef<FlatList>(null)

  // Find chatRoom by waveId
  useEffect(() => {
    if (!waveId) return
    getChatRoomByWaveId(waveId).then((room) => {
      if (room) setChatRoom(room)
    })
  }, [waveId])

  // Subscribe to messages once we have the chatRoom
  useChat(chatRoom?.id ?? null)

  const handleSend = async () => {
    if (!text.trim() || !chatRoom || !authUser) return
    const msg = text.trim()
    setText('')
    await sendMessage(chatRoom.id, authUser.uid, msg)
  }

  // Calculate remaining time
  const expiresAt = chatRoom?.expiresAt?.toDate?.()
  const remainingMs = expiresAt ? expiresAt.getTime() - Date.now() : 0
  const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)))
  const remainingMinutes = Math.max(0, Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)))

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.senderId === authUser?.uid
    const isSystem = item.type === 'system'

    if (isSystem) {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.text}</Text>
        </View>
      )
    }

    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.bubbleText}>{item.text}</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.timer}>
          {remainingHours}h {remainingMinutes}m remaining
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { color: colors.primary, fontSize: 16 },
  timer: { color: colors.warning, fontSize: 13, fontWeight: '500' },
  messageList: { padding: 16, paddingBottom: 8 },
  systemMessage: { alignItems: 'center', marginVertical: 8 },
  systemText: { color: colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 16, marginBottom: 8 },
  bubbleOwn: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surfaceLight,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { color: colors.text, fontSize: 15 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 12,
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendText: { color: colors.text, fontWeight: '600' },
})
