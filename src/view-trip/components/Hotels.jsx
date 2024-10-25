import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

import { GetPlaceDetails } from '@/service/GlobalApi';

function Hotels({ trip }) {
  const [placePhotos, setPlacePhotos] = useState({});  // State to store photos for each hotel
  const [isLoading, setIsLoading] = useState(false);   // State to show loading state
  const [error, setError] = useState('');              // State to store any error message

  // Fetch Place ID using Autocomplete and then fetch Place Details
  const fetchPlaceIdAndPhotos = async (destination, hotelIndex) => {
    try {
      // Fetch Place ID using the autocomplete API
      const autocompleteResponse = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${destination}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`
      );
      const autocompleteData = await autocompleteResponse.json();

      // Check if we received any suggestions
      if (autocompleteData && autocompleteData.predictions && autocompleteData.predictions.length > 0) {
        const placeId = autocompleteData.predictions[0].place_id; // Get the first place's place_id

        // Now fetch the place details using the place_id
        fetchPlaceDetails(placeId, hotelIndex);
      } else {
        console.error('No suggestions available for the provided destination');
      }
    } catch (error) {
      console.error('Error fetching Place ID:', error);
    }
  };

  // Fetch Place Details using Place ID
  const fetchPlaceDetails = async (placeId, hotelIndex) => {
    try {
      const result = await GetPlaceDetails(placeId); // Fetch place details using place_id
      console.log(result.data); // Log place details

      // Extract the photo with the maximum width from the result if available
      if (result.data && result.data.result && result.data.result.photos) {
        const maxWidthPhoto = result.data.result.photos.reduce((maxPhoto, currentPhoto) => {
          return currentPhoto.width > (maxPhoto.width || 0) ? currentPhoto : maxPhoto;
        }, {});

        // Create the URL for the photo with the maximum width
        const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${maxWidthPhoto.photo_reference}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`;
        setPlacePhotos(prevPhotos => ({ ...prevPhotos, [hotelIndex]: photoUrl })); // Set the photo URL in the state for each hotel
      } else {
        console.log('No photos available for this location.');
        setPlacePhotos(prevPhotos => ({ ...prevPhotos, [hotelIndex]: '' })); // No photos, reset the state for that hotel
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  // Fetch place photos for each hotel on initial render or when trip changes
  useEffect(() => {
    if (trip?.tripData?.hotelOptions) {
      setIsLoading(true); // Start loading

      trip.tripData.hotelOptions.forEach((hotel, index) => {
        if (!placePhotos[index]) { // Avoid re-fetching if we already have the photo
          fetchPlaceIdAndPhotos(hotel.hotelName, index);
        }
      });

      setIsLoading(false); // Stop loading when all API calls are complete
    }
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

      {isLoading && <p>Loading...</p>}    {/* Show loading while fetching */}
      {error && <p>{error}</p>}           {/* Show error if something goes wrong */}

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <Link 
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName},${hotel.hotelAddress}`} 
            target="_blank"
          >
            <div className='hover:scale-105 transition-all cursor-pointer'>
              {placePhotos[index] ? (
                <img src={placePhotos[index]} className='h-[200px] w-[350px] rounded-xl' alt={hotel.hotelName} />
              ) : (
                <img src='/placeholder.jpeg' className='h-[200px] w-[350px] rounded-xl' alt="Placeholder" />
              )}

              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>{hotel?.hotelName}</h2>
                <h2 className='text-xs text-gray-500'>📍{hotel?.hotelAddress}</h2>
                <h2 className='text-sm'>💸{hotel?.price}</h2>
                <h2 className='text-sm'>⭐{hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
