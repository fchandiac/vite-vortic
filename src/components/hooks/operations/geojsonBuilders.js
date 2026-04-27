/**
 * Pure GeoJSON object factories (no Turf dependency).
 * @module operations/geojsonBuilders
 */

/**
 * @returns {import('geojson').FeatureCollection}
 */
export function createEmptyFeatureCollection() {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

/**
 * @param {number[][]} coordinates - [lng, lat] pairs
 * @returns {import('geojson').Feature<import('geojson').MultiPoint>}
 */
export function createMultiPointFeature(coordinates) {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPoint",
      coordinates,
    },
  };
}

/**
 * @param {[number, number]} coordinate - [lng, lat]
 * @returns {import('geojson').Feature<import('geojson').Point>}
 */
export function createPointFeature(coordinate) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: coordinate,
    },
    properties: {},
  };
}
