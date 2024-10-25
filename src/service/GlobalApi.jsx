import axios from 'axios';

const BASE_URL = 'https://maps.gomaps.pro/maps/api/place/details/json';

export const GetPlaceDetails = (placeId) => {
  const config = {
    params: {
      key: import.meta.env.VITE_GOMAP_PLACE_API_KEY, // API key
      place_id: placeId,  // Place ID to fetch details for
      fields: 'name,photos', // Request place name and photos
    },
  };

  return axios.get(BASE_URL, config);
};
