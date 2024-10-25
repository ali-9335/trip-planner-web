import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { Link } from 'react-router-dom'; // Add this line to import Link

function UserTripCardItem({ trip }) {
  const [placePhoto, setPlacePhoto] = useState('');  // State to store the fetched photo

  useEffect(() => {
    if (trip?.userSelection?.destination) {
      fetchPlaceIdAndPhotos(trip.userSelection.destination); // Fetch photo when destination is set
    }
  }, [trip]);

  // Fetch Place ID using Autocomplete and then fetch Place Details
  const fetchPlaceIdAndPhotos = async (destination) => {
    try {
      const autocompleteResponse = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${destination}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`
      );
      const autocompleteData = await autocompleteResponse.json();

      if (autocompleteData?.predictions?.length > 0) {
        const placeId = autocompleteData.predictions[0].place_id; // Get the first place's place_id
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
      const result = await GetPlaceDetails(placeId);
      if (result?.data?.result?.photos) {
        const maxWidthPhoto = result.data.result.photos.reduce((maxPhoto, currentPhoto) => {
          return currentPhoto.width > (maxPhoto.width || 0) ? currentPhoto : maxPhoto;
        }, {});

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
    <Link to={'/view-trip/'+trip?.id}>
      <div className="hover:scale-105 transition-all border rounded-lg p-4">
        {placePhoto ? (
          <img src={placePhoto} className='object-cover rounded-xl w-full h-[220px]' alt='Destination' />
        ) : (
          <img src='/placeholder.jpeg' className='object-cover rounded-xl w-full h-[250px]' alt='Placeholder' />
        )}
        <div className="mt-2">
          <h2 className='font-bold text-lg'>{trip?.userSelection?.destination}</h2>
          <h2>{trip?.userSelection?.days} Days trip with {trip?.userSelection?.budget} Budget</h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
