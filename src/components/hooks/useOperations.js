import React from "react";
import * as d3 from "d3";
import * as turf from "@turf/turf";

export default function useOperations() {
  const crearObjetoPoint = (coordinate) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinate,
      },
      properties: {},
    };
  };

  const convertToTurfPoint = (point) => {
    if (
      !Array.isArray(point) ||
      point.length !== 2 ||
      typeof point[0] !== "number" ||
      typeof point[1] !== "number"
    ) {
      throw new Error("Invalid point coordinates.");
    }
    return turf.point(point);
  };

  const extractCoordinates = (geojson) => {
    const coordinates = geojson.map(
      (feature) => feature.geometry.coordinates[0]
    );
    var points = coordinates.flatMap(function (coordinate) {
      return coordinate; // Devuelve directamente los puntos individuales
    });
    return points;
  };

  const extractFeatures = (geojson) => {
    console.log(geojson);
    return geojson.features;
  };

  function removeDuplicateCoordinates(geoJSONCollection) {
    const seenCoordinates = new Set();
    const filteredCollection = [];

    geoJSONCollection.forEach((feature) => {
      const coordinates = feature.geometry.coordinates.join(",");
      if (!seenCoordinates.has(coordinates)) {
        seenCoordinates.add(coordinates);
        filteredCollection.push(feature);
      }
    });

    return filteredCollection;
  }

  const calculateConvexHullFromGeoJSON = (geojson) => {
    var points = turf.featureCollection([
      turf.point([10.195312, 43.755225]),
      turf.point([10.404052, 43.8424511]),
      turf.point([10.579833, 43.659924]),
      turf.point([10.360107, 43.516688]),
      turf.point([10.14038, 43.588348]),
      turf.point([10.195312, 43.755225]),
    ]);

    var hull = turf.convex(points);

    console.log(hull);
  };

  const suavizarPoligono = (poligono) => {
    const coordinates = poligono.geometry.coordinates[0]; // Obtener las coordenadas del polígono
    let smoothedCoordinates = coordinates.slice(); // Clonar las coordenadas para no modificar las originales

    // Aplicar el algoritmo de suavizado de Chaikin
    for (let i = 0; i < 5; i++) {
      // Iterar varias veces para un suavizado más efectivo
      const newCoordinates = [];
      for (let j = 0; j < smoothedCoordinates.length; j++) {
        if (j === 0) {
          newCoordinates.push(smoothedCoordinates[j]); // Mantener el primer vértice sin cambios
        } else {
          const p0 = smoothedCoordinates[j - 1];
          const p1 = smoothedCoordinates[j];
          const p2 = smoothedCoordinates[(j + 1) % smoothedCoordinates.length];
          const Q = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
          const R = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
          newCoordinates.push(Q, R); // Agregar nuevos vértices intermedios
        }
      }
      smoothedCoordinates = newCoordinates; // Actualizar las coordenadas suavizadas
    }

    // Crear un nuevo polígono con las coordenadas suavizadas
    return turf.polygon([smoothedCoordinates]);
  };

  const smoothPolygon = (polygon, iterations) => {
    const coordinates = polygon.geometry.coordinates[0];
    let smoothedCoordinates = coordinates.slice();

    for (let i = 0; i < iterations; i++) {
      const newCoordinates = [];
      for (let j = 0; j < smoothedCoordinates.length; j++) {
        if (j === 0) {
          newCoordinates.push(smoothedCoordinates[j]);
        } else {
          const p0 = smoothedCoordinates[j - 1];
          const p1 = smoothedCoordinates[j];
          const p2 = smoothedCoordinates[(j + 1) % smoothedCoordinates.length];
          const Q = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
          const R = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
          newCoordinates.push(Q, R);
        }
      }
      smoothedCoordinates = newCoordinates;
    }

    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [smoothedCoordinates],
      },
      properties: {},
    };
  };

  const generarPoligonoRodeador = (poligonosGeoJSON) => {
    const puntos = turf.points([]);
    poligonosGeoJSON.forEach((poligono) => {
      const centroid = turf.centroid(poligono);
      puntos.features.push(turf.point(centroid.geometry.coordinates));
    });

    // Calcular la envolvente convexa de los puntos (centros de los polígonos)
    const convexHull = turf.convex(puntos);

    return convexHull;
  };

  const eliminarPoligonosInvalidos = (coleccion) => {
    return {
      type: "FeatureCollection",
      features: coleccion.features.filter((feature) => {
        // Verificar si la geometría es un polígono y si tiene al menos 4 puntos
        return (
          feature.geometry.type === "Polygon" &&
          feature.geometry.coordinates[0].length >= 4
        );
      }),
    };
  };

  //   const restarPoligonos = (poligonoGrande, poligonosPequenos) => {
  //     // Extraer las características (features) de los GeoJSON
  //     const turfPoligonoGrande = turf.polygon(
  //       poligonoGrande.features[0].geometry.coordinates
  //     );

  //     const featuresPoligonosPequenos = poligonosPequenos.features;
  //     const pol = [];
  //     featuresPoligonosPequenos.map((poligono) => {
  //       if (poligono.geometry.coordinates[0]) {
  //         const prePoly = poligono.geometry.coordinates[0];
  //         if (prePoly.length > 3) {
  //           pol.push(prePoly);
  //         }
  //       }
  //     });

  //     const turfPoligonosPequenos = turf.multiPolygon(pol);

  //     //console.log(turfPoligonosPequenos);

  //     //let resultado = poligonoGrande;

  //     // featuresPoligonosPequenos.forEach((poligono) => {
  //     //     console.log(poligono);
  //     //     resultado = turf.difference(resultado, poligono);
  //     // });

  //     const resultado = turf.difference(turfPoligonoGrande, turfPoligonosPequenos);

  //     console.log(resultado);

  //     return resultado;
  //   };

  const restarPoligonos = (poligonoGrande, poligonosPequenos) => {
    // Crear polígono grande
    const turfPoligonoGrande = turf.polygon(
      poligonoGrande.features[0].geometry.coordinates
    );

    // Crear polígonos pequeños
    const poligonosValidos = poligonosPequenos.features.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });
    const turfPoligonosPequenos = turf.multiPolygon(
      poligonosValidos.map((poligono) => poligono.geometry.coordinates)
    );

    // Calcular diferencia entre polígono grande y polígonos pequeños
    const resultado = turf.difference(
      turfPoligonoGrande,
      turfPoligonosPequenos
    );

    console.log(resultado);

    return resultado;
  };

  //     const cuadricula = [];
  //     const bbox = turf.bbox(poligonoBase.features[0]); // Obtener la caja delimitadora del polígono base

  //     //console.log(bbox);

  //     const areaTrabajo = turf.bboxPolygon(bbox); // Convertir la caja delimitadora en un polígono
  //     console.log(areaTrabajo);

  //     // Calcular el tamaño de paso para la cuadrícula (3x3 metros)
  //     const paso = 0.003;

  //     for (let x = bbox[0]; x < bbox[2]; x += paso) {
  //         for (let y = bbox[1]; y < bbox[3]; y += paso) {
  //             const punto = turf.point([x, y]);
  //             if (!turf.booleanPointInPolygon(punto,poligonoBase.features[0])) {
  //                 cuadricula.push(turf.squareGrid([x, y, x + paso, y + paso], { units: 'kilometers' }));
  //             }
  //         }
  //     }

  //     //console.log(cuadricula);

  //     //return turf.union(...cuadricula); // Unir todos los polígonos de la cuadrícula en uno solo
  // };

  // const generarCuadricula = (poligonoBase) => {
  //     const cuadricula = [];
  //     const bbox = turf.bbox(poligonoBase.features[0]); // Obtener la caja delimitadora del polígono base

  //     // Calcular el tamaño de paso para la cuadrícula (3 metros)
  //     const paso = 0.001;

  //     for (let x = bbox[0]; x < bbox[2]; x += paso) {
  //         for (let y = bbox[1]; y < bbox[3]; y += paso) {
  //             const punto = turf.point([x, y]);
  //             if (!turf.booleanPointInPolygon(punto, poligonoBase.features[0])) {
  //                 cuadricula.push(punto);
  //             }
  //         }
  //     }

  //     console.log(cuadricula);

  //     return turf.featureCollection(cuadricula);
  // };

  const generarCuadricula = (poligonoBase) => {
    const cuadricula = [];
    const bbox = turf.bbox(poligonoBase.features[0]); // Obtener la caja delimitadora del polígono base

    // Calcular el tamaño de paso para la cuadrícula (3 metros)
    const paso = 0.0003;

    for (let x = bbox[0]; x < bbox[2]; x += paso) {
      for (let y = bbox[1]; y < bbox[3]; y += paso) {
        const punto = turf.point([x, y]);
        if (turf.booleanPointInPolygon(punto, poligonoBase.features[0])) {
          cuadricula.push(punto);
        }
      }
    }

    // console.log(cuadricula);

    return turf.featureCollection(cuadricula);
  };

  const restarPoligonos02 = (base, residential) => {
    // Crear polígono grande
    const turfPoligonoGrande = turf.polygon(
      base.features[0].geometry.coordinates
    );

    // Crear polígonos pequeños
    const poligonosValidos = residential.features.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });
    const turfPoligonosPequenos = turf.multiPolygon(
      poligonosValidos.map((poligono) => poligono.geometry.coordinates)
    );

    // Calcular diferencia entre polígono grande y polígonos pequeños
    const resultado = turf.difference(
      turfPoligonoGrande,
      turfPoligonosPequenos
    );

    console.log(resultado);

    return resultado;
  };

  const restarPoligonosSimples = (base, rest) => {
    // Crear polígono grande
    const turfPoligonoBase = turf.polygon(
      base.features[0].geometry.coordinates
    );
    const rest01 = rest.features[0];

    //console.log(base.features[0].geometry.coordinates);
    //console.log(rest.features[0].geometry.coordinates);

    //Crear polígonos pequeños
    const poligonosValidos = rest.features.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });
    const multiPolygon = turf.multiPolygon(rest01.geometry.coordinates);
    //console.log('Mulry', multiPolygon);

    // console.log('base', turfPoligonoBase);

    // console.log(rest01);

    // // Calcular diferencia entre polígono grande y polígonos pequeños
    const resultado = turf.difference(multiPolygon, turfPoligonoBase);

    console.log(resultado);

    //return resultado;
  };

  // function crearPoligonosDesdeLineasDeCaminos(lineasDeCaminos, distanciaTamponado) {
  //     // Crea polígonos alrededor de las líneas de caminos mediante tamponado
  //     const poligonos = turf.buffer(lineasDeCaminos, distanciaTamponado, { units: 'meters' });

  //     return poligonos;
  // }

  function crearPoligonosDesdeLineasDeCaminos(
    lineasDeCaminos,
    distanciaTamponado
  ) {
    const features = lineasDeCaminos.features;
    const poligonos = [];

    features.forEach((feature) => {
      const buffer = turf.buffer(feature, distanciaTamponado, {
        units: "meters",
      });
      poligonos.push(buffer);
    });

    console.log(poligonos);

    return turf.featureCollection(poligonos);
  }

  const restarCaminos = (poligonoBase, caminos) => {
    // Crear polígono grande
    //poligonos Validos BAse

    const coordenadas = poligonoBase.features[0].geometry;
    // console.log(coordenadas);
    // const validosBase = poligonoBase.features[0].geometry.filter(poligono => {
    //     console.log(poligono);
    //     const coordinates = poligono.geometry.coordinates;
    //     return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    // });
    //const turfPoligonoBase = turf.polygon(poligonoBase.features[0].geometry.coordinates);

    //const turfBase = turf.multiPolygon(validosBase.map(poligono => poligono.geometry.coordinates));

    // // Crear polígonos pequeños
    const poligonosValidos = caminos.features.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });
    const turfways = turf.multiPolygon(
      poligonosValidos.map((poligono) => poligono.geometry.coordinates)
    );

    // // Calcular diferencia entre polígono grande y polígonos pequeños
    const resultado = turf.difference(coordenadas, turfways);

    console.log(resultado);

    // return resultado;
  };

  const restarBuildsToResiWay = (resiWay, builds) => {
    // Crear polígono grande
    const turfResiWay = turf.multiPolygon(
      resiWay.features[0].geometry.coordinates
    );
    //console.log(turfResiWay);

    // console.log(builds);

    //Crear polígonos pequeños
    const poligonosValidos = builds.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });

    console.log(poligonosValidos);
    //const turfBuilds = turf.multiPolygon(builds.features[0].geometry.coordinates);
    const turB = turf.multiPolygon(
      poligonosValidos.map((poligono) => poligono.geometry.coordinates)
    );

    //console.log(turB);

    // // Calcular diferencia entre polígono grande y polígonos pequeños
    const resultado = turf.difference(turfResiWay, turB);

    console.log(resultado);

    // return resultado;
  };

  const polygonsSubstrac = (base, subs) => {
    const baseFeatures = base.features;
    const subFeatures = subs.features;

    //console.log(subFeatures);

    //   const poligonosValidos = builds.filter(poligono => {
    //     const coordinates = poligono.geometry.coordinates[0];
    //     return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    // });

    // console.log(poligonosValidos);
    //const turfBuilds = turf.multiPolygon(builds.features[0].geometry.coordinates);

    const validPoligons = baseFeatures.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });

    const turfBase = turf.multiPolygon(
      validPoligons.map((poligono) => poligono.geometry.coordinates)
    );

    //const turfBase = turf.multiPolygon(baseFeatures.map(poligono => poligono.geometry.coordinates));
    const turfSubs = turf.polygon(subFeatures[0].geometry.coordinates);

    console.log(turfSubs);

    //const resultado = turf.difference(turfBase, turfSubs);
    const resultado = turf.difference(turfSubs, turfSubs);

    console.log(resultado);
    return resultado;
  };

  const geoJsonBase = () => ({
    type: "FeatureCollection",
    features: [],
  });

  // const workArea = (restAll, bounds) => {

  //   const esquinasRectangulo = bounds.geometry.coordinates[0];

  //   // Función para verificar si un punto está dentro de un rectángulo
  //   const puntoDentroRectangulo = (punto, bounds) => {
  //     const [minX, minY] = bounds[0];
  //     const [maxX, maxY] = bounds[2];
  //     const [x, y] = punto;
  //     return x >= minX && x <= maxX && y >= minY && y <= maxY;
  //   };

  //   const restAllFeatures = restAll.features;

  //   console.log(restAllFeatures);

  //   const verticesDentroRectangulo = restAllFeatures[0].geometry.coordinates.map(part => {
  //     return part.filter(vertex => puntoDentroRectangulo(vertex, bounds.geometry.coordinates[0]));
  //   }).flat();

  //   verticesDentroRectangulo.push(...esquinasRectangulo);

  //   const nuevoPoligono = {
  //     type: 'Polygon',
  //     coordinates: [verticesDentroRectangulo]
  //   };

  //   const nuevoPoligonoGeoJSON = {
  //     type: 'Feature',
  //     geometry: nuevoPoligono,
  //     properties: {}
  //   };

  //   // console.log(nuevoPoligonoGeoJSON);

  //   return nuevoPoligonoGeoJSON;

  // };

  const workArea = (poligonoGrande, bounds) => {
    // Convertir el polígono grande a un objeto Turf

    //const esquinasRectangulo = bounds.geometry.coordinates[0];

    const baseFeatures = poligonoGrande.features;

    const validPoligons = baseFeatures.filter((poligono) => {
      const coordinates = poligono.geometry.coordinates[0];
      return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
    });

    const poligonoTurf = turf.multiPolygon(
      validPoligons.map((poligono) => poligono.geometry.coordinates)
    );

    // Convertir el rectángulo (bounds) a un objeto Turf
    const rectanguloTurf = turf.polygon(bounds.geometry.coordinates);

    console.log(poligonoTurf);

    // Recortar el polígono grande con el rectángulo
    //const poligonoRecortado = turf.difference(poligonoTurf, rectanguloTurf);

    // Convertir el resultado de vuelta a GeoJSON
    //const poligonoRecortadoGeoJSON = turf.getCoords(poligonoRecortado);

    // return {
    //   type: 'Feature',
    //   geometry: {
    //     type: 'Polygon',
    //     coordinates: poligonoRecortadoGeoJSON
    //   },
    //   properties: {}
    // };
  };

  const pointGeoJson = (cordinates) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPoint",
      coordinates: cordinates,
    },
  });

  // Función para crear un cuarto de círculo en la dirección sureste
  const crearCuartoCirculoSureste = (centro, radio, numPuntos) => {
    const puntosCirculo = [];
    for (let i = 0; i <= numPuntos; i++) {
        const angulo = (Math.PI / 2) * (i / numPuntos) + Math.PI / 2; // Comenzar desde 90 grados (esquina inferior derecha)
        const x = centro[0] + radio * Math.cos(angulo);
        const y = centro[1] + radio * Math.sin(angulo);
        puntosCirculo.push([x, y]);
    }
    // Añadir el primer punto al final para cerrar el polígono
    puntosCirculo.push(puntosCirculo[0]);

    const features = puntosCirculo.map((point) => {
        return {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: point,
            },
        };
    });

    return features;
};

const crearEspiral = (centro, radioInicial, incrementoAngulo, incrementoRadio, numPuntos) => {
  const puntosEspiral = [];
  let radio = radioInicial;
  for (let i = 0; i < numPuntos; i++) {
      const angulo = i * incrementoAngulo;
      const x = centro[0] + radio * Math.cos(angulo);
      const y = centro[1] + radio * Math.sin(angulo);
      puntosEspiral.push([x, y]);
      radio += incrementoRadio;
  }
  return puntosEspiral;
};

  return {
    calculateConvexHullFromGeoJSON,
    generarPoligonoRodeador,
    restarPoligonos,
    generarCuadricula,
    restarPoligonos02,
    restarPoligonosSimples,
    crearPoligonosDesdeLineasDeCaminos,
    restarCaminos,
    restarBuildsToResiWay,
    polygonsSubstrac,
    geoJsonBase,
    workArea,
    crearCuartoCirculoSureste,
    crearEspiral,
    pointGeoJson,
  };
}
