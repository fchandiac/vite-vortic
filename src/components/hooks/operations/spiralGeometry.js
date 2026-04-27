/**
 * Spiral and quarter-circle sampling in map coordinates (planar trig on lng/lat).
 * @module operations/spiralGeometry
 */

/**
 * @param {[number, number]} center - [lng, lat]
 * @param {number} radius
 * @param {number} segmentCount
 * @returns {import('geojson').Feature<import('geojson').Point>[]}
 */
export function southeastQuarterCirclePointFeatures(center, radius, segmentCount) {
  const ring = [];
  for (let i = 0; i <= segmentCount; i++) {
    const angle = (Math.PI / 2) * (i / segmentCount) + Math.PI / 2;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    ring.push([x, y]);
  }
  ring.push(ring[0]);

  return ring.map((coordinates) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates,
    },
  }));
}

/**
 * @param {[number, number]} center - [lng, lat]
 * @param {number} initialRadius
 * @param {number} angleStep - radians per step
 * @param {number} radiusGrowth
 * @param {number} pointCount
 * @returns {number[][]}
 */
export function generateSpiralCoordinates(
  center,
  initialRadius,
  angleStep,
  radiusGrowth,
  pointCount
) {
  const out = [];
  let radius = initialRadius;
  for (let i = 0; i < pointCount; i++) {
    const angle = i * angleStep;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    out.push([x, y]);
    radius += radiusGrowth;
  }
  return out;
}
