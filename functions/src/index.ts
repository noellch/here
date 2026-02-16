import * as admin from 'firebase-admin'

admin.initializeApp()

export { onWaveCreated, onWaveAccepted } from './triggers/waves'
export { onReportCreated } from './triggers/reports'
export { cleanupExpired } from './scheduled/cleanup'
