"use client"
import Image from 'next/image'
import SpotifyLogo from './spotify-logo.webp'
import { motion } from 'motion/react'

export default function ConnectSpotifyButton(
  {onClick} : {onClick:() => void}
) {


  return (
    <button className="bg-transparent tp font-light p-2 px-4 rounded-lg
    cursor-pointer flex flex-row gap-5
    group relative transition hover:tp hover:text-black
    overflow-hidden border-2 border-green-500"
    
    onClick={onClick}
    >
      <span className='w-full inset-0 scale-x-0 h-full absolute left-0 top-0 origin-left
      bg-green-500 group-hover:scale-x-120 z-10 transition rounded-r-full'>
      </span>
      <span className="group-hover:text-black group-hover:font-bold- group transition z-999 flex flex-row gap-2">
        <span className=''>Connect to spotify!</span>
        <Image src={SpotifyLogo} className='w-5' alt='' width={0} /></span>
    </button>
  )
}