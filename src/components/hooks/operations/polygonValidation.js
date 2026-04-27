/**
 * Filters polygon-bearing features for Turf boolean ops.
 * @module operations/polygonValidation
 */

/**
 * @param {import('geojson').FeatureCollection} collection
 * @returns {import('geojson').FeatureCollection}
 */
export function filterValidPolygonFeatures(collection) {
  return {
    type: "FeatureCollection",
    features: collection.features.filter((feature) => {
      return (
        feature.geometry.type === "Polygon" &&
        feature.geometry.coordinates[0].length >= 4
      );
    }),
  };
}

/**
 * @param {import('geojson').Feature[]} features
 * @returns {import('geojson').Feature<import('geojson').Polygon>[]}
 */
export function filterPolygonFeaturesWithRing(features) {
  return features.filter((feature) => {
    const coordinates = feature.geometry.coordinates[0];
    return coordinates && coordinates.length >= 4;
  });
}
