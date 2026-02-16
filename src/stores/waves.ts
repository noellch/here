import { atom } from 'nanostores'
import { Wave } from '../types'

export const $incomingWaves = atom<Wave[]>([])
export const $outgoingWaves = atom<Wave[]>([])
export const $todayWaveCount = atom(0)
export const MAX_WAVES_PER_DAY = 3
