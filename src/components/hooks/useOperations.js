import { useMemo } from "react";
import { spatialOperations } from "./operations/index.js";

/**
 * Legacy Spanish names expected by `MapComponent.jsx` (same functions as English API).
 * @type {Record<string, (...args: unknown[]) => unknown>}
 */
const legacySpanishApi = {
  calculateConvexHullFromGeoJSON: spatialOperations.runConvexHullSampleDemo,
  generarPoligonoRodeador: spatialOperations.convexHullAroundPolygonCentroids,
  restarPoligonos: spatialOperations.subtractPolygonsFromMask,
  generarCuadricula: spatialOperations.generateInteriorPointGrid,
  restarPoligonos02: spatialOperations.subtractResidentialFromBase,
  restarPoligonosSimples: spatialOperations.subtractBasePolygonFromRestMultiPolygon,
  crearPoligonosDesdeLineasDeCaminos: spatialOperations.bufferPathLinesToPolygons,
  restarCaminos: spatialOperations.subtractPathPolygonsFromBase,
  restarBuildsToResiWay: spatialOperations.subtractBuildingsFromResidentialWays,
  polygonsSubstrac: spatialOperations.subtractMultiPolygonFromSubtractionMask,
  geoJsonBase: spatialOperations.createEmptyFeatureCollection,
  workArea: spatialOperations.clipMultiPolygonToBounds,
  crearCuartoCirculoSureste: spatialOperations.southeastQuarterCirclePointFeatures,
  crearEspiral: spatialOperations.generateSpiralCoordinates,
  pointGeoJson: spatialOperations.createMultiPointFeature,
};

/**
 * Map spatial operations: English API (`spatialOperations` keys) plus legacy Spanish aliases.
 * @returns {typeof spatialOperations & typeof legacySpanishApi}
 */
export default function useOperations() {
  return useMemo(
    () => ({
      ...spatialOperations,
      ...legacySpanishApi,
    }),
    []
  );
}
