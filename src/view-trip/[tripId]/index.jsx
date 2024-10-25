import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { db } from '@/service/firebaseConfig'; // Adjust if your file is named differently

import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) { // Corrected from exist() to exists()
        console.log("Document: ", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No Such Document"); // Logging if no document is found
        toast("No trip found"); // Notify the user
      }
    } catch (error) {
      console.error("Error fetching trip data:", error); // Log any errors that occur
      toast("Error fetching trip data"); // Notify the user of the error
    }
  };

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:pd-56'>
     <InfoSection trip={trip}/>
     <Hotels trip={trip}/>
     <PlacesToVisit trip={trip}/>
     <Footer trip={trip}/>
    </div>
  );
}

export default ViewTrip;
