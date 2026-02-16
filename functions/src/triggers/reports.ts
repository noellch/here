import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const db = admin.firestore()

export const onReportCreated = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snapshot) => {
    const { reportedUserId } = snapshot.data()

    await db.collection('users').doc(reportedUserId).update({
      reportCount: admin.firestore.FieldValue.increment(1),
    })

    const userDoc = await db.collection('users').doc(reportedUserId).get()
    const reportCount = userDoc.data()?.reportCount ?? 0

    if (reportCount >= 3) {
      const greenLights = await db
        .collection('greenLights')
        .where('userId', '==', reportedUserId)
        .where('isActive', '==', true)
        .get()

      const batch = db.batch()
      greenLights.docs.forEach((doc) => {
        batch.update(doc.ref, { isActive: false })
      })
      await batch.commit()
    }
  })
