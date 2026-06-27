'use client'

import { useEffect, useRef } from "react";
import { createTl } from "./timeline";
import CustomButton from "@/src/components/CustomButton";
import { UserProfile } from "../types";


export default function UserDisplayPage({owner, onDone} : {owner:UserProfile, onDone:() => void})
{
  const profileImageRef = useRef(null)
  const nameAndExtraRef = useRef(null)
  const buttonRef = useRef(null)


  useEffect(() => {
    let tl = createTl();

    tl.fromTo(profileImageRef.current, {
      opacity:0,
      scale:0.8,
      y:-window.innerHeight,
    }, {
      opacity:1,
      y:50
    }).to(profileImageRef.current, {
      scale:1.0,
    }).to(profileImageRef.current, {
      y:0,
    }).to(nameAndExtraRef.current, {
      opacity:1,
    }).to(buttonRef.current, {
      opacity:1,
      y:0
    })
  }, [])

  const collapse = () => {
    let tl = createTl();

    tl.to(buttonRef.current, {
      opacity:0,
    }).to(nameAndExtraRef.current, {
      opacity:0,
    }).to(profileImageRef.current, {
      opacity:0,
    }, '<').then(_ => {
      onDone();
    })
  }

  const followerN = useRef(owner.followers?.total??0).current

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-5 gap-5">
      <img 
      className="lg:w-1/6 not-lg:w-2/3 rounded-full opacity-0"
      ref={profileImageRef}
      src={owner.images[0].url} />

      <div className="w-full flex flex-col items-center justify-center gap-3 opacity-0"
      ref={nameAndExtraRef}>
        <div className="font-bold text-2xl">{owner.display_name}</div>
        {followerN > 0 && <div className="font-bold text-2xl"><span className="text-emerald-500">{followerN}</span> follower{followerN != 1 ? 's' : ''}</div>}
        <a className="font-medium text-sm text-green-500">open spotify's page</a>
      </div>

      <div className="w-full flex justify-center items-center translate-y-[500px]" ref={buttonRef}>
        <CustomButton onClick={() => {
          collapse();
        }}></CustomButton>
      </div>
    </div>
  )
}