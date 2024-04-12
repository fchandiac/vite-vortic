import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useMaps from './hooks/useMaps';
import 'leaflet.heat/dist/leaflet-heat.js';
import MapWithHeatLayer from './MapWithHeatLayer';
import 'leaflet.heat';
import SearchIcon from '@mui/icons-material/Search';
// import builds from '../../public/builds copy.json'
// import buildings from '../../public/buildings.json'
// import rounded from '../../public/rounded.json'
// import restBuilds from '../../public/restBuilds.json'
// import residential from '../../public/residential.json'
// import restResidential from '../../public/restResidential.json'
// import residential02 from '../../public/residential02.json'
// import zone from '../../public/zone.json'
// import others from '../../public/others.json'
// import concrete from '../../public/concrete.json'
// import ways from '../../public/ways.json'
// import restResiWays from '../../public/restResiWays.json'
import colegios from '../../public/colegios.json'
import hospitales from '../../public/hospitales.json'
import corfo from '../../public/corfo.png'
import restAll from '../../public/restAll.json'
import gob from '../../public/gob.jpeg'
// import pointsList from '../../public/pointsList.json'

import logo from '../../public/LOGO.png'
import * as turf from "@turf/turf";




import useOperations from './hooks/useOperations';
import { Alert, AppBar, Box, Button, Snackbar, TextField, Toolbar, Typography, InputAdornment, IconButton, Stack, Grid, FormControlLabel, Switch, Autocomplete } from '@mui/material';
import useMapBox from './hooks/useMapBox';


const cols = [
  [
    -71.6311799,
    -33.0445207
  ],
  [
    -71.6314115,
    -33.046063
  ],
  [
    -71.6333646,
    -33.0465419
  ],
  [
    -71.6324955,
    -33.0448826
  ],
  [
    -71.6319537,
    -33.0442621
  ],
  [
    -71.6338124,
    -33.0465667
  ],
  [
    -71.6320127,
    -33.0469623
  ],
  [
    -71.6218335,
    -33.0508044
  ],
  [
    -71.6227075,
    -33.0542012
  ],
  [
    -71.6074842,
    -33.0491746
  ],
  [
    -71.6216881,
    -33.0547966
  ],
  [
    -71.594336,
    -33.0442542
  ],
  [
    -71.6029869,
    -33.0458496
  ],
  [
    -71.6007882,
    -33.0511966
  ],
  [
    -71.6079602,
    -33.0507634
  ],
  [
    -71.6055065,
    -33.0534123
  ],
  [
    -71.6088231,
    -33.0487857
  ],
  [
    -71.6094185,
    -33.0476188
  ],
  [
    -71.6120627,
    -33.0496973
  ],
  [
    -71.6130765,
    -33.049079
  ],
  [
    -71.6152708,
    -33.0495525
  ],
  [
    -71.6155551,
    -33.0497279
  ],
  [
    -71.6189051,
    -33.047799
  ],
  [
    -71.6015488,
    -33.0494554
  ],
  [
    -71.6024192,
    -33.0501072
  ],
  [
    -71.6011408,
    -33.0525588
  ],
  [
    -71.6343922,
    -33.0395947
  ],
  [
    -71.6265242,
    -33.0450015
  ],
  [
    -71.625395,
    -33.0518164
  ],
  [
    -71.6193495,
    -33.0489851
  ],
  [
    -71.5973593,
    -33.0430321
  ],
  [
    -71.6231326,
    -33.0491842
  ],
  [
    -71.6094885,
    -33.0645199
  ],
  [
    -71.615034,
    -33.0480247
  ],
  [
    -71.6014764,
    -33.0403966
  ],
  [
    -71.6203233,
    -33.0438047
  ],
  [
    -71.6144035,
    -33.0565505
  ],
  [
    -71.6253618,
    -33.0409584
  ],
  [
    -71.6331637,
    -33.0464092
  ],
  [
    -71.6204512,
    -33.0463495
  ]
]

const hosps = [

  [
    -71.619832,
    -33.04735
  ],
  [
    -71.6045306,
    -33.042355
  ],
  [
    -71.6097942,
    -33.0525146
  ],
  [
    -71.6225214,
    -33.0430918
  ],
  [
    -71.6231305,
    -33.0427193
  ],
  [
    -71.631205,
    -33.0490165
  ],
  [
    -71.6149418,
    -33.0492085
  ],
  [
    -71.6281108,
    -33.039472
  ],
  [
    -71.6281327,
    -33.0394501
  ],
  [
    -71.6079842,
    -33.0579605
  ],
  [
    -71.6298024,
    -33.039444
  ],
  [
    -71.6189812,
    -33.04613
  ]
]






export default function MapComponent() {
  const mapRef = useRef(null);
  const [openSnack, setOpenSnack] = useState(false)
  const [msgSnack, setMsgSnack] = useState('')
  const [polygonWork, setPolygonWork] = useState(null)
  const [zones, setZones] = useState(turf.featureCollection([]))
  const [numberStructures, setNumberStructures] = useState(0)
  const [showVorticMap, setShowVorticMap] = useState(true)
  const [loading, setLoading] = useState(false)
  const { searchPlaces } = useMapBox()
  const [showColegios, setShowColegios] = useState(true)
  const [showHospitales, setShowHospitales] = useState(true)
  const [center, setCenter] = useState([-33.047493602213684, -71.61475325745215])

  const [searchWord, setSearchWord] = useState('')
  const [searchResults, setSearchResults] = useState([])




  const { data01, generateVoronoiPolygons, generateCircles, generateGrid, generateGrid2, getBuilds } = useMaps();
  const { calculateConvexHullFromGeoJSON, generarPoligonoRodeador, restarPoligonos, generarCuadricula, restarPoligonos02, restarPoligonosSimples,
    crearPoligonosDesdeLineasDeCaminos, restarCaminos, restarBuildsToResiWay, polygonsSubstrac, geoJsonBase, workArea, crearCuartoCirculoSureste,
    crearEspiral, pointGeoJson
  } = useOperations();

  useEffect(() => {
    const fetchData = async () => {
      const results = await searchPlaces(searchWord);
      const resultFormatted = results.map((item) => ({
        id: item.id,
        key: item.id,
        center: item.center,
        name: item.place_name,
      }))

      setSearchResults(resultFormatted);
    };
    fetchData();
  }, [searchWord]);









  const customMarkerIcon = L.divIcon({
    className: 'custom-marker-icon',
    iconSize: [12, 12], // Tamaño del icono
    html: '<div style="background-color: grey; border-radius: 50%; width: 8px; height: 8px;"></div>', // HTML del icono (círculo rojo)
  });

  const customMarkerIcon02 = L.divIcon({
    className: 'custom-marker-icon',
    iconSize: [12, 12], // Tamaño del icono
    html: '<div style="background-color: blue; border-radius: 50%; width: 8px; height: 8px;"></div>', // HTML del icono (círculo rojo)
  });

  const pointToLayer = (feature, latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon }); // Usar el ícono personalizado para cada punto
  };

  const pointToLayer02 = (feature, latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon02 }); // Usar el ícono personalizado para cada punto
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.avgValue) {
      layer.bindPopup(`<strong>Average Value:</strong> ${feature.properties.avgValue}`);
    }
  };

  const geoJsonStyle = (feature) => ({
    fillColor: feature.properties.color,
    fillOpacity: 0.8,
    color: '#000',
    weight: 1,
  });

  const geoJsonStyle07 = (feature) => {
    const distanceProm = feature.properties.distanceProm;
    let color;

    // Definir los rangos y sus colores correspondientes
    const ranges = [
      { min: 0, max: 0.1, color: '#006400' },   // Verde oscuro
      { min: 0.1, max: 0.15, color: '#ADFF2F' }, // Verde amarillento
      { min: 0.15, max: 0.2, color: '#00FF00' },   // Verde lima
      { min: 0.21, max: 0.25, color: '#FFD700' },   // Amarillo anaranjado
      { min: 0.25, max: 0.3, color: '#FFA500' },   // Naranja
      { min: 0.31, max: 0.35, color: '#FF8C00' },   // Rojo anaranjado
      { min: 0.35, max: 0.4, color: '#FF4500' },   // Rojo claro
      { min: 0.41, max: 0.45, color: '#FF0000' },   // Rojo
      { min: 0.45, max: 50, color: '#8B0000' }    // Rojo oscuro
      // Puedes agregar más rangos según sea necesario
    ];

    // Encontrar el rango correspondiente y asignar el color
    for (const range of ranges) {
      if (distanceProm >= range.min && distanceProm <= range.max) {
        color = range.color;
        break;
      }
    }

    // Si no se encuentra ningún rango, asignar un color predeterminado
    if (!color) {
      color = '#808080'; // Gris por defecto
    }

    return {
      fillColor: color,
      fillOpacity: 0.5,
      color: 'black',
      weight: 1
    };
  };

  const geoJsonStyle02 = (feature) => ({
    fillColor: feature.properties.color,
    fillOpacity: 0.5,
    color: '#ba68c8',
    weight: 1,
  });

  const geoJsonStyle03 = (feature) => ({
    fillColor: feature.properties.color,
    fillOpacity: 0.1,
    color: '#00838f',
    weight: 1,
  });

  const btn = async () => {
    try {
    
      setZones(turf.featureCollection([]));

      let zoom = mapRef.current.getZoom();
      let bounds = mapRef.current.getBounds();

      if (zoom < 18) {
        throw new Error('Para realizar la operación de análisis de emplazamientos, debes hacer zoom en el mapa.');
      } else if (numberStructures <= 0) {
        throw new Error('Debes ingresar un número de estructuras mayor a 0.');
      }

      setLoading(true);
      console.log('Inicio')



      const polygonBounds = generarRectanguloGeoJSON(bounds);
      const malla = generarMallaDePuntos(polygonBounds, 0.00004);
      const pointsIn = puntosDentroDeMultipoligono(malla, restAll);
      const circles = nearGroup(pointsIn);
      const groups = encontrarGrupoIntersectado(circles);
      const zonesFeatures = await Promise.all(groups.map(group => obtenerLineasExteriores(group)));

      const zones = zonesFeatures.map(zone => ({
        type: 'Feature',
        properties: {
          area: turf.area(zone),
          quanty: Math.floor((turf.area(zone) / 250))
        },
        geometry: zone.geometry
      }));

      setZones(turf.featureCollection(zones));

      zones.map((item) => {
        const centroid = turf.centroid(item).geometry.coordinates
        const nears = nearPoints(centroid, cols, hosps)
        item.properties.distanceProm = nears

      })

      // console.log('zones', zones)







    } catch (error) {
      setMsgSnack(error.message);
      setOpenSnack(true);
      setZones(turf.featureCollection([]));
    } finally {
      console.log('fin')
      setLoading(false);
    }
  };





  return (
    <>
      <Box>
        <Toolbar style={{ backgroundColor: 'black', color: 'white' }}>
          <Box p={1}>
            <img src={logo} alt="logo" style={{ width: '40px' }} />
          </Box>
          <Box p={1} display={'flex'}>
            <Typography fontSize={28} sx={{ fontWeight: 'bold' }}>VORTIC</Typography>
          </Box>
          <Box flexGrow={1} justifyContent="flex-end" display="flex">
            <Autocomplete
              id="combo-box-demo"
              options={searchResults}
              getOptionLabel={(option) => option.name}
              style={{ width: '40vw' }}
              onChange={(event, newValue) => {
                if (newValue) {
                  setCenter(newValue.center)
                  mapRef.current.setView([newValue.center[1], newValue.center[0]], 10);
                } else {
                  setCenter([-33.047493602213684, -71.61475325745215])
                }
              }}
              noOptionsText="No se encontraron resultados"
              renderInput={(params) =>
                <
                  TextField {...params} placeholder='Busca una dirección de Valparaiso' variant="outlined"
                  value={searchWord}
                  onChange={(e) => { setSearchWord(e.target.value) }}
                  size='small' style={{ backgroundColor: 'white', borderRadius: '10px', border: '2px solid black', }}

                />}
            />
          </Box>

        </Toolbar>

      </Box>
      <Box id="map" width={'100vw'} height={'78vh'} position={'relative'}>

        <MapContainer center={center} zoom={15} style={{ width: '100%', height: '100%' }} ref={mapRef}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
          {/* {zones && <GeoJSON data={zones} style={geoJsonStyle02} />} */}

          {zones.features.map((feature, index) => (
            <GeoJSON key={index} data={feature} style={geoJsonStyle07}>
              <Popup>{`Estructuras viables: ${feature.properties.quanty}.`}</Popup>
            </GeoJSON>
          ))}

          {showVorticMap && <GeoJSON data={restAll} style={geoJsonStyle03} />}
          {showColegios && <GeoJSON data={colegios} pointToLayer={pointToLayer} />}
          {showHospitales && <GeoJSON data={hospitales} pointToLayer={pointToLayer02} />}




        </MapContainer>

        <Box style={{ position: 'absolute', top: '5rem', right: '1rem', backgroundColor: 'rgba(0,0, 0, .5)', padding: '10px', borderRadius: '5px' }} zIndex={2000}>
          <Grid container spacing={1} direction={'column'}>
            <Grid item>
              <Typography fontSize={12} sx={{ color: 'white', fontWeight: 'bold' }}>Análisis de emplazamientos</Typography>
            </Grid>
            <Grid item>
              <FormControlLabel
                sx={{ color: 'white' }}
                control={<Switch checked={showVorticMap} onChange={(e) => { setShowVorticMap(e.target.checked) }} />}
                label="Mapa base Vortic"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                sx={{ color: 'white' }}
                control={<Switch checked={showColegios} onChange={(e) => { setShowColegios(e.target.checked) }} />}
                label="Colegios"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                sx={{ color: 'white' }}
                control={<Switch checked={showHospitales} onChange={(e) => { setShowHospitales(e.target.checked) }} />}
                label="Centros de salud"
              />
            </Grid>
            <Grid item>
              <Typography fontSize={10} sx={{ color: 'white' }}>Cantidad de estructuras</Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                size='small'
                placeholder='Número de estructuras'
                type='number'
                value={numberStructures}
                onChange={(e) => { setNumberStructures(e.target.value) }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px', // Bordes redondeados
                  border: '2px solid black',
                  width: '100%',
                }}
              />
            </Grid>
            {/* <Box mt={1} display={loading == true? 'none': 'block' }>
              <Typography fontSize={10} sx={{ color: 'white' }}>Selecciona un punto en el mapa para realizar el análisis de emplazamientos.</Typography>
            </Box> */}
            <Grid item>
              <Button variant={'contained'} onClick={() => { btn() }} fullWidth size='small'>procesar</Button>
            </Grid>
            <Grid item textAlign={'right'}>
              <Button variant={'contained'} onClick={() => { setZones(turf.featureCollection([])) }} size='small'>limpiar</Button>
            </Grid>

          </Grid>
        </Box>

      </Box>



      <Box sx={{ backgroundColor: 'black', height: '30vh' }} display={'flex'}>
        <Box flexGrow={1}>
          <Typography fontSize={10} mt={3} ml={1} color={'white'} sx={{ fontWeight: 'bold', pl: 1 }} alignSelf={'end'}>v1.0.0-beta.1</Typography>
        </Box>
        <Box>
          {/* <Typography fontSize={12} sx={{ color: 'white' }}>VORTIC es una plataforma de análisis de datos geoespaciales que permite a las empresas y organizaciones tomar decisiones informadas a través de la visualización de datos en mapas interactivos.</Typography> */}
          <Stack spacing={2} direction={'column'} sx={{ color: 'white', p: 2 }}>
            <Typography fontSize={12} lineHeight={0} textAlign={'right'}>COD. 23INIM-244699</Typography>
            <Typography fontSize={12} lineHeight={0}>Fondo Semilla Inicia para Empresas Lideradas por Mujeres</Typography>
          </Stack>
        </Box>
        <Box ml={1}>
          <img src={corfo} alt="logo" style={{ width: '100px' }} />
        </Box>
        <Box mr={2}>
          <img src={gob} alt="logo" style={{ width: '100px' }} />
        </Box>
      </Box>

      <Snack open={openSnack} setOpen={setOpenSnack} msg={msgSnack} />
    </>
  );
}


const nearPoints = (referenca, cols, hosps) => {
  //console.log('referenca', referenca)

  const point = turf.point(referenca)
  //console.log('point', point)

  const colsList = turf.featureCollection([])
  cols.map((item) => {
    colsList.features.push(turf.point(item))
  })

  const hospsList = turf.featureCollection([])
  hosps.map((item) => {
    hospsList.features.push(turf.point(item))
  })


  const colsNear = turf.nearestPoint(point, colsList)
  const hospsNear = turf.nearestPoint(point, hospsList)

  //console.log('colsNear', colsNear)

  const prom = (colsNear.properties.distanceToPoint + hospsNear.properties.distanceToPoint) / 2

  return prom
}





function addHeatLayerToMap(data, map) {
  const points = data.map(feature => [
    feature.geometry.coordinates[0][0][1], // latitud
    feature.geometry.coordinates[0][0][0], // longitud
    feature.properties.avgValue * 20 // intensidad
  ]);
  const heatLayer = L.heatLayer(points, { radius: 30 }).addTo(map); // Ajusta el radio según tus necesidades
  return heatLayer;
}

const unirCirculosIntersectados = (circulos) => {
  //console.log('circulos', circulos)
  // Paso 1: Unión de círculos intersectados
  const centroids = circulos.map(circulo => turf.centroid(circulo).geometry.coordinates);

  // // Convertir los círculos a puntos y extraer sus coordenadas
  //console.log('centroid', turf.centroid(circulos[0]).geometry.coordinates)
  //const puntos = poligonos.map(circulo => turf.centroid(circulo).geometry.coordinates);

  //console.log('centroids', centroids)

  // // Crear un casco convexo que englobe todos los puntos
  const cascoConvexo = turf.convex({ type: 'FeatureCollection', features: centroids.map(centro => turf.point(centro)) });

  // // Devolver el casco convexo como resultado
  return [cascoConvexo];
};
// Función para fusionar círculos que se intersectan


// Ejemplo de uso
const circulos = [
  turf.circle([0, 0], 100),
  turf.circle([150, 150], 50),
  turf.circle([-50, -50], 80),
  turf.circle([200, 200], 60)
];




const Snack = (props) => {
  const { open, setOpen, msg } = props


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>

      <Snackbar
        open={open}
        autoHideDuration={3000} // Duración en milisegundos que estará visible
        onClose={handleClose}
        sx={{ mt: 6 }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert variant='filled' severity='error'>{msg}</Alert>
      </Snackbar>
    </>
  );
};


function generarRectanguloGeoJSON(coordenadas) {
  const { _southWest, _northEast } = coordenadas;

  // Formar las coordenadas del rectángulo
  const coordenadasRectangulo = [
    [_southWest.lng, _southWest.lat],
    [_northEast.lng, _southWest.lat],
    [_northEast.lng, _northEast.lat],
    [_southWest.lng, _northEast.lat],
    [_southWest.lng, _southWest.lat] // Se cierra el polígono repitiendo la primera coordenada
  ];

  // Crear el objeto GeoJSON
  const rectanguloGeoJSON = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [coordenadasRectangulo]
    }
  };

  return rectanguloGeoJSON;
}

const generarMallaDePuntos = (rectangulo, separacion) => {
  const bbox = turf.bbox(rectangulo);
  const puntos = [];

  for (let x = bbox[0]; x <= bbox[2]; x += separacion) {
    for (let y = bbox[1]; y <= bbox[3]; y += separacion) {
      const punto = turf.point([x, y]);
      if (turf.booleanPointInPolygon(punto, rectangulo)) {
        puntos.push(turf.getCoord(punto));
      }
    }
  }

  return puntos;
};


const puntosDentroDeMultipoligono = (puntos, multipoligono) => {
  const resultados = [];

  const validPoligons = multipoligono.features.filter((poligono) => {
    const coordinates = poligono.geometry.coordinates[0];
    return coordinates && coordinates.length >= 4; // Filtrar polígonos válidos
  });

  //console.log('validPoligons', validPoligons)

  // const multiPol = turf.multiPolygon(
  //   validPoligons.map((poligono) => poligono.geometry.coordinates)
  // );

  puntos.forEach(punto => {
    // Verificar si el punto está dentro del multipolígono
    if (turf.booleanPointInPolygon(punto, validPoligons[0])) {
      resultados.push(punto);
    }
  });

  return resultados;
};


const esCuadrado = (puntos) => {
  // Calcular las distancias entre los puntos opuestos
  const distancia1 = turf.distance(puntos[0], puntos[2]);
  const distancia2 = turf.distance(puntos[1], puntos[3]);
  // Verificar si las distancias son iguales
  return distancia1 === distancia2;
};



const insideCircle = (reference, points) => {
  // const radio = 9
  const radio = 9
  const circulo = turf.circle(reference, radio, { steps: 20, units: 'meters' })
  const puntosEnCirculo = points.filter(punto => turf.booleanPointInPolygon(punto, circulo));

  const result = puntosEnCirculo.length >= 17 ? true : false


  return {
    circle: circulo,
    result: result
  };



}

const encontrarGrupoIntersectado = (circulos) => {
  const grupos = [];
  const evaluados = new Set();

  const calcularCentroide = (circulo) => {
    const bbox = turf.bbox(circulo);
    return turf.point([(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]);
  };

  const dfs = (circuloActual, grupoActual) => {
    // Marcar el círculo actual como evaluado
    evaluados.add(circuloActual.properties.id);
    // Agregar el círculo actual al grupo actual
    grupoActual.push(circuloActual);

    // Buscar círculos cercanos al círculo actual
    for (const circuloMasCercano of circulos) {
      if (!evaluados.has(circuloMasCercano.properties.id)) {
        // Calcular los centros de los círculos
        const centroCirculoActual = calcularCentroide(circuloActual);
        const centroCirculoMasCercano = calcularCentroide(circuloMasCercano);
        const distancia = turf.distance(centroCirculoActual, centroCirculoMasCercano);

        const radio = 9

        // Verificar si el círculo más cercano se intersecta con el círculo actual
        if (distancia <= radio && turf.booleanOverlap(circuloActual, circuloMasCercano)) {
          // Si se intersectan, llamar recursivamente a dfs con el círculo más cercano
          dfs(circuloMasCercano, grupoActual);
        }
      }
    }
  };

  // Recorrer todos los círculos para encontrar grupos de círculos interconectados
  for (const circulo of circulos) {
    if (!evaluados.has(circulo.properties.id)) {
      const nuevoGrupo = [];
      dfs(circulo, nuevoGrupo);
      grupos.push(nuevoGrupo);
    }
  }

  return grupos;
};


const obtenerLineasExteriores = (poligonos) => {

  //console.log('poligonos', poligonos)
  // Convertir los polígonos en una única geometría multipolígono
  const multipoligono = turf.multiPolygon(poligonos.map(poligono => poligono.geometry.coordinates));
  //console.log('multipoligono', multipoligono)

  // // Combinar los polígonos
  const combinado = turf.combine(multipoligono);
  //console.log('combinado', combinado)

  // // Crear un buffer alrededor de la geometría combinada

  //console.log('buffer', buffer)

  // // Obtener la diferencia entre el buffer y la geometría combinada
  const lineasExteriores = turf.convex(combinado);


  return lineasExteriores;
};



// const encontrarGrupoIntersectado = (circulos) => {
//   const grupos = [];
//   const evaluados = new Set();

//   const dfs = (circuloActual, grupoActual) => {
//     // Marcar el círculo actual como evaluado
//     evaluados.add(circuloActual.properties.id);
//     // Agregar el círculo actual al grupo actual
//     grupoActual.push(circuloActual);

//     console.log('circuloActual', circuloActual)

//     // Buscar círculos cercanos al círculo actual
//     for (const circuloMasCercano of circulos) {
//       if (!evaluados.has(circuloMasCercano.properties.id)) {
//         const distancia = turf.distance(circuloActual, circuloMasCercano);
//         // Verificar si el círculo más cercano se intersecta con el círculo actual
//         if (distancia <= radio && turf.booleanOverlap(circuloActual, circuloMasCercano)) {
//           // Si se intersectan, llamar recursivamente a dfs con el círculo más cercano
//           dfs(circuloMasCercano, grupoActual);
//         }
//       }
//     }
//   };

//   // Recorrer todos los círculos para encontrar grupos de círculos interconectados
//   for (const circulo of circulos) {
//     if (!evaluados.has(circulo.properties.id)) {
//       const nuevoGrupo = [];
//       dfs(circulo, nuevoGrupo);
//       grupos.push(nuevoGrupo);
//     }
//   }

//   return grupos;
// };


// Función para detectar intersecciones entre círculos
const detectarIntersecciones = (circulos) => {

  const intersecciones = [];
  for (let i = 0; i < circulos.length; i++) {
    for (let j = i + 1; j < circulos.length; j++) {
      const circuloA = circulos[i];
      const circuloB = circulos[j];
      // Verificar si los círculos se intersectan
      if (turf.booleanOverlap(circuloA, circuloB)) {
        intersecciones.push([i, j]);
      }
    }
  }
  return intersecciones;
};

const agruparCirculosIntersectados = (circulos, mapaIntersecciones) => {
  const visitados = new Set();
  const grupos = [];

  const dfs = (nodo, grupo) => {
    visitados.add(nodo);
    grupo.push(nodo);
    if (mapaIntersecciones.has(nodo)) {
      for (const vecino of mapaIntersecciones.get(nodo)) {
        if (!visitados.has(vecino)) {
          dfs(vecino, grupo);
        }
      }
    }
  };

  for (let i = 0; i < circulos.length; i++) {
    if (!visitados.has(i)) {
      const nuevoGrupo = [];
      dfs(i, nuevoGrupo);
      grupos.push(nuevoGrupo);
    }
  }

  const poligonos = [];
  grupos.forEach(grupo => {
    const circulosGrupo = grupo.map(i => circulos[i]);
    const geometria = turf.union(...circulosGrupo);
    poligonos.push({
      type: 'Feature',
      properties: {},
      geometry: geometria
    });
  });

  return poligonos;
};





// const agruparCirculosIntersectados = (circulos, intersecciones) => {
//   const poligonos = [];

//   // Crear un conjunto para mantener un registro de los índices de los círculos ya agregados
//   const circulosAgregados = new Set();

//   // Crear polígonos para círculos individuales no intersectados
//   circulos.forEach((circulo, indice) => {
//     if (!circulosAgregados.has(indice)) {
//       poligonos.push(circulo);
//       circulosAgregados.add(indice);
//     }

//     // Buscar intersecciones en las que participe este círculo
//     intersecciones.forEach(([circuloA, circuloB]) => {
//       if (circulo === circuloA && !circulosAgregados.has(intersecciones.indexOf(circuloB))) {
//         // Fusionar geometrías de círculos intersectados
//         const geometria = turf.union(circuloA, circuloB);
//         poligonos.push(geometria);
//         circulosAgregados.add(intersecciones.indexOf(circuloB));
//       } else if (circulo === circuloB && !circulosAgregados.has(intersecciones.indexOf(circuloA))) {
//         // Fusionar geometrías de círculos intersectados
//         const geometria = turf.union(circuloA, circuloB);
//         poligonos.push(geometria);
//         circulosAgregados.add(intersecciones.indexOf(circuloA));
//       }
//     });
//   });

//   return poligonos;
// };






// const detectarIntersecciones = (circulos) => {
//   //const cirulos = turf.featureCollection(circulos_.map(circulo => turf.polygon(circulo.geometry.coordinates)))
//   const intersecciones = [];

//   for (let i = 0; i < circulos.length; i++) {
//       for (let j = i + 1; j < circulos.length; j++) {
//           const circuloA = circulos[i];
//           const circuloB = circulos[j];

//           // Verificar si los círculos se intersectan
//           if (turf.booleanOverlap(circuloA, circuloB)) {
//               intersecciones.push([circuloA, circuloB]);
//           }
//       }
//   }

//   return intersecciones;
// };

// const agruparCirculosIntersectados = (circulos, intersecciones) => {
//   const poligonos = [];

//   // Crear polígonos para círculos individuales no intersectados
//   circulos.forEach(circulo => {
//       let intersectado = false;
//       intersecciones.forEach(([circuloA, circuloB]) => {
//           if (circulo === circuloA || circulo === circuloB) {
//               intersectado = true;
//           }
//       });

//       if (!intersectado) {
//           poligonos.push(circulo);
//       }
//   });

//   // Crear polígonos exteriores para grupos de círculos intersectados
//   intersecciones.forEach(([circuloA, circuloB]) => {
//       // Fusionar geometrías de círculos intersectados
//       const geometria = turf.union(circuloA, circuloB);
//       poligonos.push(geometria);
//   });

//   return poligonos;
// };




const nearGroup = (puntos) => {
  const group = [];

  puntos.map(point => {
    const resultCircle = insideCircle(point, puntos)
    if (resultCircle.result == true) {
      group.push(resultCircle.circle)
    }
  })

  const process = group.map((item, index) => ({
    type: 'Feature',
    properties: {
      id: index
    },
    geometry: item.geometry
  }))



  return process
};






// const polygonBlounds = generarRectanguloGeoJSON(bounds)
// const initPoint = polygonBlounds.geometry.coordinates[0][0]

// const point01 = polygonBlounds.geometry.coordinates[0][0]
// const point02 = polygonBlounds.geometry.coordinates[0][1]
// const point03 = polygonBlounds.geometry.coordinates[0][2]
// const point04 = polygonBlounds.geometry.coordinates[0][3]
// const punto06 = turf.midpoint(turf.point(point01), turf.point(point02)).geometry.coordinates
// const punto07 = turf.midpoint(turf.point(point02), turf.point(point03)).geometry.coordinates
// const punto08 = turf.midpoint(turf.point(point03), turf.point(point04)).geometry.coordinates
// const punto09 = turf.midpoint(turf.point(point04), turf.point(point01)).geometry.coordinates
// const centro = [mapRef.current.getCenter().lng, mapRef.current.getCenter().lat]; // Centro de la espiral
// const point10 = turf.midpoint(turf.point(centro), turf.point(punto06)).geometry.coordinates
// const point11 = turf.midpoint(turf.point(centro), turf.point(punto07)).geometry.coordinates
// const point12 = turf.midpoint(turf.point(centro), turf.point(punto08)).geometry.coordinates
// const point13 = turf.midpoint(turf.point(centro), turf.point(punto09)).geometry.coordinates



// const radioInicial = 0.000001; // Radio inicial de la espiral
// const incrementoAngulo = Math.PI / 10; // Incremento de ángulo (en radianes)
// const incrementoRadio = 0.00003; // Incremento de radio
// const numPuntos = 100;

// console.log('centro', centro)

// const spiral01 = crearEspiral(point01, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral02 = crearEspiral(point02, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral03 = crearEspiral(point03, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral04 = crearEspiral(point04, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral05 = crearEspiral(centro, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral06 = crearEspiral(punto06, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral07 = crearEspiral(punto07, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral08 = crearEspiral(punto08, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral09 = crearEspiral(punto09, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral10 = crearEspiral(point10, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral11 = crearEspiral(point11, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral12 = crearEspiral(point12, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);
// const spiral13 = crearEspiral(point13, radioInicial, incrementoAngulo, incrementoRadio, numPuntos);


// const spiralCollection01 = spiral01.map((item) => turf.point(item))
// const spiralCollection02 = spiral02.map((item) => turf.point(item))
// const spiralCollection03 = spiral03.map((item) => turf.point(item))
// const spiralCollection04 = spiral04.map((item) => turf.point(item))
// const spiralCollection05 = spiral05.map((item) => turf.point(item))
// const spiralCollection06 = spiral06.map((item) => turf.point(item))
// const spiralCollection07 = spiral07.map((item) => turf.point(item))
// const spiralCollection08 = spiral08.map((item) => turf.point(item))
// const spiralCollection09 = spiral09.map((item) => turf.point(item))
// const spiralCollection10 = spiral10.map((item) => turf.point(item))
// const spiralCollection11 = spiral11.map((item) => turf.point(item))
// const spiralCollection12 = spiral12.map((item) => turf.point(item))
// const spiralCollection13 = spiral13.map((item) => turf.point(item))

// const concatSpiral = spiralCollection01.concat(
//   spiralCollection02,
//   spiralCollection03,
//   spiralCollection04, 
//   spiralCollection05, 
//   spiralCollection06, 
//   spiralCollection07, 
//   spiralCollection08, 
//   spiralCollection09,
//   spiralCollection10,
//   spiralCollection11,
//   spiralCollection12,
//   spiralCollection13
//   )


// //console.log('radar', radar) 
// // const radarPolygon = turf.polygon([radar])

// // console.log('concatSpiral', concatSpiral)

// const workAreaPolygon =
// {
//   "type": "FeatureCollection",
//   "features": concatSpiral
// }

// console.log('workAreaPolygon', workAreaPolygon)


// setPolygonWork(workAreaPolygon)



const btnPass = () => {
  setZones(turf.featureCollection([]))
  // console.log('ref', mapRef.current.getBounds())
  // console.log('ref', mapRef.current.getCenter())
  // console.log('ref', mapRef.current.getZoom())
  let zoom = mapRef.current.getZoom()
  let bounds = mapRef.current.getBounds()

  // console.log('zoom', zoom)
  if (zoom < 18) {
    setMsgSnack('Para realizar la operación de análisis de emplazamientos, debes hacer zoom en el mapa.')
    setOpenSnack(true)
    setZones(turf.featureCollection([]))
  } else if (numberStructures <= 0) {
    setMsgSnack('Debes ingresar un número de estructuras mayor a 0.')
    setOpenSnack(true)
    setZones(turf.featureCollection([]))
  } else {
    setLoading(true)
    const polygonBlounds = generarRectanguloGeoJSON(bounds)
    //console.log('polygonBlounds', polygonBlounds)

    const malla = generarMallaDePuntos(polygonBlounds, 0.00004)

    const pointsIn = puntosDentroDeMultipoligono(malla, restAll)

    const circles = nearGroup(pointsIn)

    //console.log('circles', circles)

    const groups = encontrarGrupoIntersectado(circles)


    const zonesFeatures = groups.map(group => obtenerLineasExteriores(group))

    const zon = zonesFeatures.map(zone => ({
      type: 'Feature',
      properties: {
        area: turf.area(zone),
        quanty: Math.floor((turf.area(zone) / 250))
      },
      geometry: zone.geometry
    }

    ))
    console.log('zones', zon)
    //console.log('malla', turf.featureCollection(pointsIn.map(item => turf.point(item))))
    //console.log('featuresDePuntos', featuresDePuntos)
    //setPolygonWork(featuresDePuntos)
    console.log(turf.featureCollection(zon))
    setZones(turf.featureCollection(zon))
    setLoading(false)

  }
}
