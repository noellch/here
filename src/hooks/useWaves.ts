import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { $authUser } from '../stores/auth'
import { $incomingWaves, $outgoingWaves } from '../stores/waves'
import { subscribeToIncomingWaves, subscribeToOutgoingWaves } from '../services/waves'

export function useWaves() {
  const authUser = useStore($authUser)

  useEffect(() => {
    if (!authUser) return

    const unsubIncoming = subscribeToIncomingWaves(authUser.uid, (waves) => {
      $incomingWaves.set(waves)
    })
    const unsubOutgoing = subscribeToOutgoingWaves(authUser.uid, (waves) => {
      $outgoingWaves.set(waves)
    })

    return () => {
      unsubIncoming()
      unsubOutgoing()
    }
  }, [authUser])
}
