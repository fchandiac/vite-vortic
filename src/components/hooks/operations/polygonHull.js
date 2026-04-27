/**
 * Convex hull helpers (Turf).
 * @module operations/polygonHull
 */

import * as turf from "@turf/turf";

/**
 * @deprecated Demo only; kept for legacy `calculateConvexHullFromGeoJSON` signature.
 * @param {unknown} [legacyInput]
 * @returns {void}
 */
export function runConvexHullSampleDemo(legacyInput) {
  void legacyInput;
  const points = turf.featureCollection([
    turf.point([10.195312, 43.755225]),
    turf.point([10.404052, 43.8424511]),
    turf.point([10.579833, 43.659924]),
    turf.point([10.360107, 43.516688]),
    turf.point([10.14038, 43.588348]),
    turf.point([10.195312, 43.755225]),
  ]);

  const hull = turf.convex(points);
  if (hull && typeof console !== "undefined" && console.debug) {
    console.debug("[operations/polygonHull] sample convex hull", hull);
  }
}

/**
 * @param {import('geojson').FeatureCollection} collection
 * @returns {import('geojson').Feature<import('geojson').Polygon> | null}
 */
export function computeConvexHullFromPolygonCollection(collection) {
  const vertices = [];

  for (const f of collection.features) {
    const { geometry } = f;
    if (!geometry) continue;

    if (geometry.type === "Polygon") {
      for (const c of geometry.coordinates[0]) {
        vertices.push(turf.point(c));
      }
    } else if (geometry.type === "MultiPolygon") {
      for (const polygon of geometry.coordinates) {
        for (const c of polygon[0]) {
          vertices.push(turf.point(c));
        }
      }
    }
  }

  if (vertices.length < 3) {
    return null;
  }

  return turf.convex(turf.featureCollection(vertices));
}

/**
 * @param {import('geojson').Feature<import('geojson').Polygon>[]} polygonFeatures
 * @returns {import('geojson').Feature<import('geojson').Polygon> | null}
 */
export function convexHullAroundPolygonCentroids(polygonFeatures) {
  const pointFeatures = polygonFeatures.map((polygon) => {
    const centroid = turf.centroid(polygon);
    return turf.point(centroid.geometry.coordinates);
  });

  if (pointFeatures.length < 1) {
    return null;
  }

  return turf.convex(turf.featureCollection(pointFeatures));
}
