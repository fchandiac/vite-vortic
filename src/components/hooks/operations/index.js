/**
 * Spatial / GeoJSON helpers for the Vortic map (Turf). See each submodule for behaviour.
 * @module operations
 */

import { createEmptyFeatureCollection, createMultiPointFeature, createPointFeature } from "./geojsonBuilders.js";
import {
  flattenPolygonRingCoordinates,
  getFeatureCollectionFeatures,
  removeDuplicateCoordinateFeatures,
  toTurfPoint,
} from "./geojsonCollectionUtils.js";
import { bufferPathLinesToPolygons } from "./pathBuffers.js";
import {
  clipMultiPolygonToBounds,
  subtractBasePolygonFromRestMultiPolygon,
  subtractBuildingsFromResidentialWays,
  subtractMultiPolygonFromSubtractionMask,
  subtractPathPolygonsFromBase,
  subtractPolygonsFromMask,
  subtractResidentialFromBase,
} from "./polygonBoolean.js";
import { DEFAULT_CHAIKIN_ITERATIONS, DEFAULT_INTERIOR_GRID_STEP } from "./constants.js";
import { generateInteriorPointGrid } from "./polygonGrid.js";
import {
  computeConvexHullFromPolygonCollection,
  convexHullAroundPolygonCentroids,
  runConvexHullSampleDemo,
} from "./polygonHull.js";
import { smoothPolygonChaikin, smoothPolygonChaikinAsTurfPolygon } from "./polygonSmoothing.js";
import { filterValidPolygonFeatures } from "./polygonValidation.js";
import { generateSpiralCoordinates, southeastQuarterCirclePointFeatures } from "./spiralGeometry.js";

/** @readonly */
export const spatialOperations = {
  DEFAULT_CHAIKIN_ITERATIONS,
  DEFAULT_INTERIOR_GRID_STEP,

  runConvexHullSampleDemo,
  computeConvexHullFromPolygonCollection,
  convexHullAroundPolygonCentroids,

  subtractPolygonsFromMask,
  subtractResidentialFromBase,
  subtractBasePolygonFromRestMultiPolygon,
  subtractPathPolygonsFromBase,
  subtractBuildingsFromResidentialWays,
  subtractMultiPolygonFromSubtractionMask,
  clipMultiPolygonToBounds,

  generateInteriorPointGrid,
  bufferPathLinesToPolygons,

  smoothPolygonChaikin,
  smoothPolygonChaikinAsTurfPolygon,

  createEmptyFeatureCollection,
  createMultiPointFeature,
  createPointFeature,
  toTurfPoint,
  flattenPolygonRingCoordinates,
  getFeatureCollectionFeatures,
  removeDuplicateCoordinateFeatures,
  filterValidPolygonFeatures,

  southeastQuarterCirclePointFeatures,
  generateSpiralCoordinates,
};
