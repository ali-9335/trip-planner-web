import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  const [placePhoto, setPlacePhoto] = useState('');  // State to store the fetched photo
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [error, setError] = useState('');            // State for error handling

  // Fetch Place ID using Autocomplete and then fetch Place Details
  const fetchPlaceIdAndPhotos = async (destination) => {
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
        fetchPlaceDetails(placeId);
      } else {
        console.error('No suggestions available for the provided destination');
      }
    } catch (error) {
      console.error('Error fetching Place ID:', error);
    }
  };

  // Fetch Place Details using Place ID
  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/details/json?place_id=${placeId}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`
      );
      const result = await response.json();

      // Extract the photo with the maximum width from the result if available
      if (result.result && result.result.photos) {
        const maxWidthPhoto = result.result.photos.reduce((maxPhoto, currentPhoto) => {
          return currentPhoto.width > (maxPhoto.width || 0) ? currentPhoto : maxPhoto;
        }, {});

        // Create the URL for the photo with the maximum width
        const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${maxWidthPhoto.photo_reference}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`;
        setPlacePhoto(photoUrl); // Set the photo URL in the state
      } else {
        console.log('No photos available for this location.');
        setPlacePhoto('/placeholder.jpeg'); // Set placeholder image if no photo is available
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      setPlacePhoto('/placeholder.jpeg'); // Set placeholder image in case of an error
    }
  };

  // Fetch the place photo once when the component mounts or when `place.placeName` changes
  useEffect(() => {
    if (place?.placeName) {
      setIsLoading(true);
      fetchPlaceIdAndPhotos(place.placeName).finally(() => setIsLoading(false));
    }
  }, [place.placeName]);

  return (
    <Link to={`https://www.google.com/maps/search/?api=1&query=${place.placeName}`} target="_blank">
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        {isLoading ? (
          <div className="w-[130px] h-[130px] flex justify-center items-center">
            <p>Loading...</p>
          </div>
        ) : (
          <img 
            src={placePhoto || '/placeholder.jpeg'} 
            className='w-[130px] h-[130px] rounded-xl' 
            alt={place.placeName} 
          />
        )}
        <div>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-600'>{place.placeDetails}</p>
          <h2 className='mt-2'>🕓{place.timeToTravel}</h2>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
