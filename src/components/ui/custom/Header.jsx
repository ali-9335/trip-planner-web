import React, { useEffect, useState } from 'react'
import { Button } from '../button'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Header() {
  const [openDialog, setOpenDialog] = useState(false); 

  const user=JSON.parse(localStorage.getItem('user'));
 
  useEffect(()=>{
    console.log(user);
    console.log(user?.picture);
  },[])

  
  const login = useGoogleLogin({
    onSuccess: (codeResp) => {GetUserProfile(codeResp);  // Call the function with the access token response
    },
    onError: (error) => console.log(error)
  });

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
      window.location.reload();
    
    })
    
  }
  return (
      <div className='p-3 shadow-sm flex justify-between items-center px-5 '>
        <img src="/logo.svg"/>
        <div className=''>
          {
          user?
          <div className='flex items-center gap-5'>
             <a href='/create-trip'>
            <Button variant="outline" className="rounded-full">+Create Trip</Button>
            </a>
            <a href='/my-trips'>
            <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>
            <Popover>
  <PopoverTrigger>
    <img className="w-[35px] h-[35px] rounded-full"  src={user?.picture}/>
  </PopoverTrigger>
  <PopoverContent><h2 className='cursor-pointer' onClick={()=>{
    googleLogout();
    localStorage.clear();
    window.location.reload();
    
  }}>Logout</h2></PopoverContent>
</Popover>

          </div>:
            <Button onClick={()=>setOpenDialog(true)}>Sign up</Button>
          }
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
  )
}

export default Header
