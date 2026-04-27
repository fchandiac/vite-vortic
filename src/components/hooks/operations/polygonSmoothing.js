/**
 * Chaikin polygon outline smoothing.
 * @module operations/polygonSmoothing
 */

import * as turf from "@turf/turf";
import { DEFAULT_CHAIKIN_ITERATIONS } from "./constants.js";

/**
 * @param {import('geojson').Feature<import('geojson').Polygon>} polygon
 * @param {number} [iterations=5]
 * @returns {import('geojson').Feature<import('geojson').Polygon>}
 */
export function smoothPolygonChaikin(polygon, iterations = DEFAULT_CHAIKIN_ITERATIONS) {
  const coordinates = polygon.geometry.coordinates[0];
  let smoothedCoordinates = coordinates.slice();

  for (let i = 0; i < iterations; i++) {
    const newCoordinates = [];
    for (let j = 0; j < smoothedCoordinates.length; j++) {
      if (j === 0) {
        newCoordinates.push(smoothedCoordinates[j]);
      } else {
        const p0 = smoothedCoordinates[j - 1];
        const p1 = smoothedCoordinates[j];
        const p2 = smoothedCoordinates[(j + 1) % smoothedCoordinates.length];
        const Q = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        const R = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        newCoordinates.push(Q, R);
      }
    }
    smoothedCoordinates = newCoordinates;
  }

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [smoothedCoordinates],
    },
    properties: { ...polygon.properties },
  };
}

/**
 * @param {import('geojson').Feature<import('geojson').Polygon>} polygon
 * @param {number} [iterations=5]
 * @returns {import('geojson').Feature<import('geojson').Polygon>}
 */
export function smoothPolygonChaikinAsTurfPolygon(polygon, iterations = DEFAULT_CHAIKIN_ITERATIONS) {
  const smoothed = smoothPolygonChaikin(polygon, iterations);
  return turf.polygon(smoothed.geometry.coordinates);
}
