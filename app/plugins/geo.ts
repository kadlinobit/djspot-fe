// import _ from 'lodash'
import { defineNuxtPlugin } from '#app'
import circle from '@turf/circle'

export default defineNuxtPlugin((nuxtApp) => {
    type GpsPoint = [number, number]

    type Units = 'kilometers'

    interface Geometry {
        type: string
        coodinates: GpsPoint[]
    }

    /**
     * Returns radius polygon coordinates around a given point and a radius in kilometers
     * @param {Point} point - gps point [ longitude, latitude ]
     * @param {number} radius - radius in kilometers
     * @returns {Geometry} - geometry of calculated radius polygon { type: 'Polygon', coordinates: [[lon1, lat1], [lon2, lat2], ...]}
     */
    function getPointRadius(point: GpsPoint, radius: number) {
        const unit: Units = 'kilometers'
        const options = { steps: 6, unit }
        const circlePolygon = circle(point, radius, options)

        return circlePolygon.geometry
    }

    function getCityWithRadiusFilterForApi() {}

    const api = { getPointRadius }

    nuxtApp.provide('geo', api)
})
