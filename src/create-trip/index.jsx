import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelersList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { chatSession } from '@/service/AIModal';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from '@react-oauth/google'; // Import the hook
import { FcGoogle } from "react-icons/fc";
import { db } from '@/service/firebaseConfig'; // Adjust if your file is named differently
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [inputValue, setInputValue] = useState('');  
  const [suggestions, setSuggestions] = useState([]); 
  const [place, setPlace] = useState(); 
  const [formData, setFormData] = useState({}); 
  const [openDialog, setOpenDialog] = useState(false); 
  const [loading,setloading]=useState(false);
 const navigate=useNavigate();
  const handleInputChange = async (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData); 
  }, [formData]);

  const handleDestinationInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleInputChange('destination', value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${value}&key=${import.meta.env.VITE_GOMAP_PLACE_API_KEY}`
        );
        const data = await response.json();
        if (data && data.predictions) {
          setSuggestions(data.predictions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);
    setPlace(suggestion);
    handleInputChange('destination', suggestion.description);
  };

  const handleBudgetSelection = (budget) => {
    handleInputChange('budget', budget.title);
  };

  const handleTravelersSelection = (travelers) => {
    handleInputChange('travelers', travelers.title);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {GetUserProfile(codeResp);  // Call the function with the access token response
    },
    onError: (error) => console.log(error)
  });
  

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }
  
     if (!formData?.destination || !formData?.budget || !formData.travelers || !formData?.days && formData.days<=5) {
      toast('PLEASE FILL ALL DETAILS'); // Ensure this is used properly
      return;
    }
  
    setloading(true);
  
    try {
      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', formData?.destination)
        .replace('{days}', formData?.days)
        .replace('{travelers}', formData?.travelers)
        .replace('{budget}', formData?.budget)
        .replace('{tdays}', formData?.days);
        
      console.log(FINAL_PROMPT);
      
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const tripResponse = await result?.response?.text();
      
      if (tripResponse) {
        console.log("--", tripResponse);
        await SaveAiTrip(tripResponse);
      }
    } catch (error) {
      console.error('Error generating trips:', error);
    } finally {
      setloading(false); // Ensure loading state is reset
    }
  };
  
  const SaveAiTrip = async (TripData) => {
    try {
      setloading(true);
      
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();  // Fixed Date typo to Date.now()
      
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      navigate('/view-trip/'+docId);
  
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setloading(false); // Ensure loading state is reset
    }
  };
  
  const GetUserProfile=(tokeninfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokeninfo?.access_token}`,{
      header:{
        Authorization:`Bearer ${tokeninfo?.access_token}`,
        Accept:`Application/json`
      }
    }
    ).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
    
  }

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide us the basic information, and our trip planner will plan the trip.
      </p>
      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">What's your destination?</h2>
          <input
            type="text"
            value={inputValue}
            onChange={handleDestinationInputChange}
            placeholder="Enter a destination"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 mt-2 rounded bg-white max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning to visit?</h2>
          <Input 
            placeholder={'Ex. 3'} 
            type='number' 
            onChange={(e) => handleInputChange('days', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What's your Budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${formData?.budget === item.title && 'shadow-lg border-black'}`}
              onClick={() => handleBudgetSelection(item)}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelersList.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${formData?.travelers === item.title && 'shadow-lg border-black'}`}
                onClick={() => handleTravelersSelection(item)}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='my-10 justify-end flex'>
        
        <Button
  disabled={loading}
  onClick={OnGenerateTrip}
>
  {loading ? (
    <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
  ) : (
    "Generate Trip"
  )}
</Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <button style={{ display: 'none' }}>Trigger Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo"/>
              <h2 className='font-bold text-lg mt-5'>Sign in with Google</h2>
              <p>Sign in to the app with Google authentication security</p>
              <Button  onClick={login} className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle className='h-7 w-7' />Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
