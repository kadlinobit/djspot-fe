import circle from '@turf/circle'
import type { GeoPoint } from '~/plugins/directus/types'

export function getPointRadius(point: GeoPoint, radius: number) {
    return circle(point, radius, { steps: 6, unit: 'kilometers' }).geometry
}
