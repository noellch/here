import { atom } from 'nanostores'
import { User } from '../types'

export const $authUser = atom<{ uid: string; phone: string } | null>(null)
export const $userProfile = atom<User | null>(null)
export const $authLoaded = atom(false)
export const $profileComplete = atom(false)
