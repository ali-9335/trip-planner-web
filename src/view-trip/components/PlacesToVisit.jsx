import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  // Safely check if tripData and itinerary exist
  const itinerary = trip?.tripData?.itinerary || []; // Default to an empty array

  return (
    <div>
      <h2 className='font-bold text-lg'>Places to Visit</h2>
      <div>
        {itinerary.length === 0 ? ( // Check if itinerary is empty
          <p>No itinerary available.</p>
        ) : (
          itinerary.map((item, index) => (
            <div key={index} className='mt-5'>
              <h2 className='font-medium text-lg'>{item.day}</h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {item.plan.map((place, index) => (
                  <div key={index}>
                    <h2 className='font-medium text-sm text-orange-500'>{place.time}</h2>
                    <PlaceCardItem place={place} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;
