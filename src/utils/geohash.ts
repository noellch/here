import ngeohash from 'ngeohash'

const GEOHASH_PRECISION = 6

export function encodeGeohash(lat: number, lng: number): string {
  return ngeohash.encode(lat, lng, GEOHASH_PRECISION)
}

export function getGeohashNeighborhood(lat: number, lng: number): string[] {
  const center = encodeGeohash(lat, lng)
  const neighbors = ngeohash.neighbors(center)
  return [center, ...neighbors]
}
