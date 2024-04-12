import React from 'react'

export default function useMapBox() {
    const searchPlaces = async (query) => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=pk.eyJ1IjoiZmNoYW5kaWFjIiwiYSI6ImNsdXB6MGZmZTI2ZzAyaXAxNG5rZGJwZ3MifQ.-I9u0cSkMM0I-xWdzWhbJg`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }
          const data = await response.json();
          return data.features;
        } catch (error) {
          console.error('Error searching places:', error);
          return [];
        }
      };
        
      
      return { searchPlaces };
  
}
