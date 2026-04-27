/**
 * Buffer path / line features to polygons.
 * @module operations/pathBuffers
 */

import * as turf from "@turf/turf";

/**
 * @param {import('geojson').FeatureCollection} pathLines
 * @param {number} bufferMeters
 * @returns {import('geojson').FeatureCollection}
 */
export function bufferPathLinesToPolygons(pathLines, bufferMeters) {
  const polygons = [];

  pathLines.features.forEach((feature) => {
    const buffered = turf.buffer(feature, bufferMeters, {
      units: "meters",
    });
    polygons.push(buffered);
  });

  return turf.featureCollection(polygons);
}
