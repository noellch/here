export function fuzzLocation(lat: number, lng: number): { lat: number; lng: number } {
  const minDistance = 150
  const maxDistance = 250

  const theta = Math.random() * 2 * Math.PI
  const distance = minDistance + Math.random() * (maxDistance - minDistance)

  const dLat = (distance * Math.cos(theta)) / 111320
  const dLng = (distance * Math.sin(theta)) / (111320 * Math.cos((lat * Math.PI) / 180))

  return {
    lat: lat + dLat,
    lng: lng + dLng,
  }
}

export function distanceBetween(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
