import React, { useEffect, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { GetPlaceDetails } from '@/service/GlobalApi';

function InfoSection({ trip }) {
  const [placePhoto, setPlacePhoto] = useState('');  // State to store the fetched photo with max width

  useEffect(() => {
    if (trip?.userSelection?.destination) {
      fetchPlaceIdAndPhotos(trip.userSelection.destination); // Fetch photo when destination is set
    }
  }, [trip]);

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
      const result = await GetPlaceDetails(placeId); // Fetch place details using place_id
      console.log(result.data); // Log place details

      // Extract the photo with the maximum width from the result if available
      if (result.data && result.data.result && result.data.result.photos) {
        const maxWidthPhoto = result.data.result.photos.reduce((maxPhoto, currentPhoto) => {
          return currentPhoto.width > (maxPhoto.width || 0) ? currentPhoto : maxPhoto;
        }, {});

        // Create the URL for the photo with the maximum width
        const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${maxWidthPhoto.photo_reference}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`;
        setPlacePhoto(photoUrl); // Set the photo URL in the state
      } else {
        console.log('No photos available for this location.');
        setPlacePhoto(''); // No photos, reset the state
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.destination}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-300 rounded-full text-gray-500 text-xs md:text-md'>
              📆 {trip.userSelection?.days} days
            </h2>
            <h2 className='p-1 px-3 bg-gray-300 rounded-full text-gray-500 text-xs md:text-md'>
              💰 {trip.userSelection?.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-300 rounded-full text-gray-500 text-xs md:text-md'>
              👪 Type of Travelers: {trip.userSelection?.travelers}
            </h2>
          </div>
        </div>
        
      </div>

      {/* Render the fetched photo with the maximum width if available, or a placeholder */}
      {placePhoto ? (
        <img src={placePhoto} className='h-[340px] w-full object-cover rounded-xl' alt='Place' />
      ) : (
        <img src='/placeholder.jpeg' className='h-[340px] w-full object-cover rounded-xl' alt="Placeholder" />
      )}
    </div>
  );
}

export default InfoSection;
