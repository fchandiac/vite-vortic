/**
 * Point sampling inside polygon masks.
 * @module operations/polygonGrid
 */

import * as turf from "@turf/turf";
import { DEFAULT_INTERIOR_GRID_STEP } from "./constants.js";

/**
 * @param {import('geojson').FeatureCollection} mask
 * @param {number} [stepDegrees=DEFAULT_INTERIOR_GRID_STEP]
 * @returns {import('geojson').FeatureCollection<import('geojson').Point>}
 */
export function generateInteriorPointGrid(
  mask,
  stepDegrees = DEFAULT_INTERIOR_GRID_STEP
) {
  const gridPoints = [];
  const firstPolygon = mask.features[0];
  const bbox = turf.bbox(firstPolygon);

  for (let x = bbox[0]; x < bbox[2]; x += stepDegrees) {
    for (let y = bbox[1]; y < bbox[3]; y += stepDegrees) {
      const pt = turf.point([x, y]);
      if (turf.booleanPointInPolygon(pt, firstPolygon)) {
        gridPoints.push(pt);
      }
    }
  }

  return turf.featureCollection(gridPoints);
}
