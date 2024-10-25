import React from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div
      className='flex flex-col justify-center items-center gap-9 bg-cover bg-center'
      style={{
        backgroundImage: "url('landing.jpg')",
        height: '100vh', // Full height of the viewport
        width: '100vw',  // Full width of the viewport
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
    >
      <h1 className='font-extrabold text-[50px] text-center bg-opacity-80 p-4 rounded-md'>
        <span className='text-[#f56551]'>Discover your next Adventure with AI:</span> 
         <br></br>Personalized Itineraries at your Fingertips
      </h1>
      <p className='text-xl text-gray-600 text-center font-bold bg-opacity-80 p-4 rounded-md'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
  
      <Link to={'/create-trip'}>
        <Button>Get Started</Button>
      </Link>
    </div>
  )
}

export default Hero
