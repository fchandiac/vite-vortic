import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat'; // Asegúrate de importar el plugin Leaflet-heat si aún no lo has hecho

const MapWithHeatLayer = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Inicialización del mapa
    mapRef.current = L.map('map', {
      center: [-23.66511439561954, -46.489342251452101], // Latitud y longitud del centro del mapa
      zoom: 12, // Nivel de zoom inicial
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ]
    });

    // Definición del objeto JSON con datos de los polígonos
    const json_dados_poligonos = { /* Tu JSON de datos de polígonos */ };

    // Conversión de los datos GeoJSON a un formato adecuado para la capa de calor
    function geoJson2heat(geojson, weightProperty) {
      return geojson.features.map(function(feature) {
        // Verificar si el tipo de geometría es un polígono
        if (feature.geometry.type === 'Polygon') {
          // Obtener el primer conjunto de coordenadas del polígono
          const coordinates = feature.geometry.coordinates[0];
          // Calcular el punto medio del polígono
          const midPoint = calculatePolygonMidPoint(coordinates);
          // Devolver el punto medio y el valor de peso de la propiedad
          return [
            midPoint[1], // Latitud
            midPoint[0], // Longitud
            feature.properties[weightProperty] // Valor de peso
          ];
        }
        return null; // Si no es un polígono, devolver null
      }).filter(point => point !== null); // Filtrar puntos nulos
    }

    // Función para calcular el punto medio de un polígono
    function calculatePolygonMidPoint(coordinates) {
      let sumLat = 0;
      let sumLng = 0;
      coordinates.forEach(coord => {
        sumLat += coord[1];
        sumLng += coord[0];
      });
      const avgLat = sumLat / coordinates.length;
      const avgLng = sumLng / coordinates.length;
      return [avgLng, avgLat];
    }

    // Creación de la capa de calor con los datos de polígonos
    const polygons_hm = geoJson2heat(json_dados_poligonos, 'avgValue'); // Utiliza el nombre de la propiedad "avgValue"
    const layer_polygons = L.heatLayer(polygons_hm, {
      attribution: '',
      interactive: true,
      radius: 30,
      max: 1, // Valor máximo del rango
      minOpacity: 1,
      gradient: { /* Gradiente de colores para la capa de calor */ }
    });

    // Agregar la capa de calor al mapa
    layer_polygons.addTo(mapRef.current);

    // Limpiar al desmontar el componente
    return () => {
      mapRef.current.remove(); // Eliminar el mapa y todas las capas asociadas al desmontar el componente
    };
  }, []); // La dependencia vacía asegura que este efecto se ejecute solo una vez, equivalente a componentDidMount

  return (
    <div id="map" style={{ height: '400px' }}></div> // Contenedor del mapa
  );
};

export default MapWithHeatLayer;
