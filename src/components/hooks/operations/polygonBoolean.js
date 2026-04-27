/**
 * Turf polygon difference / intersection.
 * @module operations/polygonBoolean
 */

import * as turf from "@turf/turf";
import { filterPolygonFeaturesWithRing } from "./polygonValidation.js";

/**
 * @param {import('geojson').FeatureCollection} mask
 * @param {import('geojson').FeatureCollection} obstacles
 * @returns {import('geojson').Feature | null}
 */
export function subtractPolygonsFromMask(mask, obstacles) {
  const maskPolygon = turf.polygon(mask.features[0].geometry.coordinates);

  const valid = filterPolygonFeaturesWithRing(obstacles.features);
  if (valid.length === 0) {
    return maskPolygon;
  }

  const obstaclesMulti = turf.multiPolygon(
    valid.map((feature) => feature.geometry.coordinates)
  );

  return turf.difference(maskPolygon, obstaclesMulti);
}

/**
 * @param {import('geojson').FeatureCollection} baseArea
 * @param {import('geojson').FeatureCollection} residentialPolygons
 * @returns {import('geojson').Feature | null}
 */
export function subtractResidentialFromBase(baseArea, residentialPolygons) {
  return subtractPolygonsFromMask(baseArea, residentialPolygons);
}

/**
 * @param {import('geojson').FeatureCollection} base
 * @param {import('geojson').FeatureCollection} rest
 * @returns {import('geojson').Feature | null}
 */
export function subtractBasePolygonFromRestMultiPolygon(base, rest) {
  const basePolygon = turf.polygon(base.features[0].geometry.coordinates);
  const restMulti = turf.multiPolygon(rest.features[0].geometry.coordinates);

  return turf.difference(restMulti, basePolygon);
}

/**
 * @param {import('geojson').FeatureCollection} baseMask
 * @param {import('geojson').FeatureCollection} paths
 * @returns {import('geojson').Feature | null}
 */
export function subtractPathPolygonsFromBase(baseMask, paths) {
  const baseFeature = baseMask.features[0];

  const validPaths = filterPolygonFeaturesWithRing(paths.features);
  if (validPaths.length === 0) {
    return baseFeature;
  }

  const pathsMulti = turf.multiPolygon(
    validPaths.map((feature) => feature.geometry.coordinates)
  );

  return turf.difference(baseFeature, pathsMulti);
}

/**
 * @param {import('geojson').FeatureCollection} ways
 * @param {import('geojson').Feature[]} buildings
 * @returns {import('geojson').Feature | null}
 */
export function subtractBuildingsFromResidentialWays(ways, buildings) {
  const waysMulti = turf.multiPolygon(ways.features[0].geometry.coordinates);

  const validBuildings = filterPolygonFeaturesWithRing(buildings);
  if (validBuildings.length === 0) {
    return waysMulti;
  }

  const buildingsMulti = turf.multiPolygon(
    validBuildings.map((feature) => feature.geometry.coordinates)
  );

  return turf.difference(waysMulti, buildingsMulti);
}

/**
 * @param {import('geojson').FeatureCollection} base
 * @param {import('geojson').FeatureCollection} subs
 * @returns {import('geojson').Feature | null}
 */
export function subtractMultiPolygonFromSubtractionMask(base, subs) {
  const validBase = filterPolygonFeaturesWithRing(base.features);
  if (validBase.length === 0) {
    return null;
  }

  const baseMulti = turf.multiPolygon(
    validBase.map((feature) => feature.geometry.coordinates)
  );

  const subFeature = subs.features[0];
  const subPolygon = turf.polygon(subFeature.geometry.coordinates);

  return turf.difference(baseMulti, subPolygon);
}

/**
 * @param {import('geojson').FeatureCollection} basePolygons
 * @param {import('geojson').Feature<import('geojson').Polygon>} bounds
 * @returns {import('geojson').Feature | null}
 */
export function clipMultiPolygonToBounds(basePolygons, bounds) {
  const valid = filterPolygonFeaturesWithRing(basePolygons.features);
  if (valid.length === 0) {
    return null;
  }

  const baseMulti = turf.multiPolygon(
    valid.map((feature) => feature.geometry.coordinates)
  );

  const boundsPoly = turf.polygon(bounds.geometry.coordinates);

  return turf.intersection(baseMulti, boundsPoly);
}
