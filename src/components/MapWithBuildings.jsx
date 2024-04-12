import React, { useEffect, useState, useRef } from 'react';
const token = 'pk.eyJ1IjoiZmNoYW5kaWFjIiwiYSI6ImNsdXB6MGZmZTI2ZzAyaXAxNG5rZGJwZ3MifQ.-I9u0cSkMM0I-xWdzWhbJg';
import { Map, useMap } from 'react-map-gl';


const MapWithBuildings = () => {
  const mapRef = useRef(null);


  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      console.log(map); // Aquí tendrás acceso al objeto de mapa

      // Realizar la consulta para obtener los polígonos de la capa "building"
      const getBuildingPolygons = () => {
        let geo = []
        const features = map.queryRenderedFeatures({ layers: ['building'] });
        features.forEach(feature => {
          console.log(feature)
          const geoFeature = {
            "type": feature.type,
            "properties": {
              id: feature.id
            },
            "geometry": feature.geometry,
            paint: {
              'fill-color': 'red', // Color rojo
              'fill-opacity': 0.6 // Opacidad del relleno
            }
          }
          geo.push(geoFeature)
        })
        console.log(geo)

      };

      const timer = setTimeout(getBuildingPolygons, 1000);


      return () => clearTimeout(timer);
    }
  }, []);
  

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={token}
      longitude={-71.616295}
      latitude={-33.059646}
      zoom={14}
      style={{width: '100vw', height: '100vh'}}
      mapStyle='mapbox://styles/fchandiac/cluq0mqd1001301qn3z6z01c1'
      onLoad={() => console.log('Map loaded')}
    />
  );
};

export default MapWithBuildings;




