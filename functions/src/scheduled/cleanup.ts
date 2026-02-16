import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const db = admin.firestore()

export const cleanupExpired = functions.pubsub
  .schedule('every 15 minutes')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()

    const expiredWaves = await db
      .collection('waves')
      .where('status', '==', 'pending')
      .where('expiresAt', '<=', now)
      .get()

    const waveBatch = db.batch()
    expiredWaves.docs.forEach((doc) => {
      waveBatch.update(doc.ref, { status: 'expired' })
    })
    await waveBatch.commit()

    const expiredGreenLights = await db
      .collection('greenLights')
      .where('isActive', '==', true)
      .where('expiresAt', '<=', now)
      .get()

    const glBatch = db.batch()
    expiredGreenLights.docs.forEach((doc) => {
      glBatch.update(doc.ref, { isActive: false })
    })
    await glBatch.commit()

    const expiredChats = await db
      .collection('chatRooms')
      .where('isActive', '==', true)
      .where('expiresAt', '<=', now)
      .get()

    const chatBatch = db.batch()
    expiredChats.docs.forEach((doc) => {
      chatBatch.update(doc.ref, { isActive: false })
    })
    await chatBatch.commit()

    console.log(
      `Cleanup: ${expiredWaves.size} waves, ${expiredGreenLights.size} green lights, ${expiredChats.size} chat rooms expired`,
    )
  })
