import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const db = admin.firestore()

export const onWaveAccepted = functions.firestore
  .document('waves/{waveId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    if (before.status !== 'pending' || after.status !== 'accepted') return

    const waveId = context.params.waveId
    const { fromUserId, toUserId, intentTag, icebreaker } = after

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const chatRoomRef = await db.collection('chatRooms').add({
      participants: [fromUserId, toUserId],
      waveId,
      intentTag,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      isActive: true,
    })

    await chatRoomRef.collection('messages').add({
      senderId: 'system',
      text: icebreaker,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      type: 'system',
    })

    const [fromUser, toUser] = await Promise.all([
      db.collection('users').doc(fromUserId).get(),
      db.collection('users').doc(toUserId).get(),
    ])

    const fromData = fromUser.data()
    const toData = toUser.data()

    if (fromData?.fcmToken) {
      await admin.messaging().send({
        token: fromData.fcmToken,
        notification: {
          title: 'Wave accepted!',
          body: `${toData?.displayName ?? 'Someone'} accepted your wave! Start chatting.`,
        },
        data: { chatRoomId: chatRoomRef.id },
      })
    }
  })

export const onWaveCreated = functions.firestore
  .document('waves/{waveId}')
  .onCreate(async (snapshot) => {
    const wave = snapshot.data()
    const { toUserId, fromUserId, intentTag } = wave

    const [fromUser, toUser] = await Promise.all([
      db.collection('users').doc(fromUserId).get(),
      db.collection('users').doc(toUserId).get(),
    ])

    const fromData = fromUser.data()
    const toData = toUser.data()

    if (toData?.fcmToken) {
      const INTENT_EMOJIS: Record<string, string> = {
        coffee: '☕',
        exercise: '🏃',
        cowork: '💻',
        language: '🗣️',
        gaming: '🎮',
        drinks: '🍻',
      }
      const emoji = INTENT_EMOJIS[intentTag] ?? '👋'

      await admin.messaging().send({
        token: toData.fcmToken,
        notification: {
          title: `${emoji} New Wave!`,
          body: `${fromData?.displayName ?? 'Someone'} wants to ${intentTag} with you!`,
        },
        data: { waveId: snapshot.id },
      })
    }
  })
