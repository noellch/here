import { atom } from 'nanostores'
import { GreenLight, IntentTag } from '../types'

export const $myGreenLight = atom<GreenLight | null>(null)
export const $nearbyGreenLights = atom<GreenLight[]>([])
export const $selectedIntentFilter = atom<IntentTag | null>(null)
export const $greenLightLoading = atom(false)
