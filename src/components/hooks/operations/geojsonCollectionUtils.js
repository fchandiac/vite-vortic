/**
 * Utilities for reading and deduplicating GeoJSON feature collections.
 * @module operations/geojsonCollectionUtils
 */

import * as turf from "@turf/turf";

/**
 * @param {unknown} point
 * @returns {import('geojson').Feature<import('geojson').Point>}
 */
export function toTurfPoint(point) {
  if (
    !Array.isArray(point) ||
    point.length !== 2 ||
    typeof point[0] !== "number" ||
    typeof point[1] !== "number"
  ) {
    throw new Error("Invalid point coordinates: expected [lng, lat] number pair.");
  }
  return turf.point(point);
}

/**
 * @param {Array<{ geometry: { coordinates: number[][][] } }>} geojson
 * @returns {number[][]}
 */
export function flattenPolygonRingCoordinates(geojson) {
  const coordinates = geojson.map(
    (feature) => feature.geometry.coordinates[0]
  );
  return coordinates.flatMap((coordinate) => coordinate);
}

/**
 * @param {import('geojson').FeatureCollection} geojson
 * @returns {import('geojson').Feature[]}
 */
export function getFeatureCollectionFeatures(geojson) {
  return geojson.features;
}

/**
 * @param {import('geojson').Feature[]} geoJSONCollection
 * @returns {import('geojson').Feature[]}
 */
export function removeDuplicateCoordinateFeatures(geoJSONCollection) {
  const seenCoordinates = new Set();
  const filteredCollection = [];

  geoJSONCollection.forEach((feature) => {
    const key = JSON.stringify(feature.geometry.coordinates);
    if (!seenCoordinates.has(key)) {
      seenCoordinates.add(key);
      filteredCollection.push(feature);
    }
  });

  return filteredCollection;
}
