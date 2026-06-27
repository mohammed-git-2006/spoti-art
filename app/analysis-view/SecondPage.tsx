'use client'

import { useEffect, useRef } from "react"
import { SpotiArtResult, UserProfile } from "../types"
import { createTl } from "./timeline"
import CountUp from "@/src/bits/CountUp"
import CircularGallery from "@/src/bits/CircularGallery"
import CustomButton from "@/src/components/CustomButton"

export default function SecondPage({owner, info, onDone, analytics} : 
  { owner:UserProfile, info:SpotiArtResult, onDone:()=> void, 
    analytics:any
  })
{
  const titleRef    = useRef(null)
  const timeRef     = useRef(null)
  const galleryRef  = useRef(null)
  const buttonRef   = useRef(null)
  


  useEffect(() => {
    const tl = createTl();

    tl.to(titleRef.current, {
      opacity:1
    }).to(timeRef.current, {
      opacity:1
    }, '+=1.0').to(galleryRef.current, {
      opacity:1
    }).to(buttonRef.current, {
      opacity:1,
      y:0
    }, '-=0.2')
  }, [])

  let collapse = () => {
    const tl = createTl();
    
    tl.to(buttonRef.current, {
      // y:500,
      opacity:0,
    }).to(galleryRef.current, {
      opacity:.0
    }).to(timeRef.current, {
      // x:window.innerWidth
      opacity:0,
    }).to(titleRef.current, {
      // x:-window.innerWidth
      opacity:0,
    }, '<').then(_ => {
      onDone();
    })
  }

  return <div className="w-full flex-1 ovreflow-y-hidden flex flex-col gap-5 items-center justify-center">
    <div className="flex lg:flex-row not-lg:flex-col items-center gap-2 ">
      <div ref={titleRef} className="font-bold text-lg tracking-wide opacity-0">
        <span className="text-green-400">
          <CountUp
          from={0}
          to={info.items.length}
          separator=","
          direction="up"
          duration={2.5}
          className="text-xl"
          delay={0}
          />
        </span> items recovered
      </div>
      <div ref={timeRef} className="font-bold text-lg tracking-wide opacity-0">
        <span className="text-green-400 text-xl">
          {(analytics.totalDuration as number).toFixed(0)}
        </span> minutes total
      </div>
    </div>
    <div ref={galleryRef} className="w-full lg:h-60 not-lg:h-[280px] opacity-0">
      <CircularGallery
        items={new Array(20).fill(0).map((_, i) => {
          return i > info.items.length ? null : info.items[i];
        }).filter(e => e != null).map(e => ({text:e.name, image:e.img??''}))}
        bend={0.75}
        textColor="#ffffff"
        borderRadius={0.05}
        scrollEase={0.05}
        fontUrl="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        font="bold 30px 'Open Sans'"
        scrollSpeed={5}
      />
    </div>
    <div className="w-full flex justify-center items-center translate-y-[500px]" ref={buttonRef}>
      <CustomButton onClick={() => {
        collapse();
      }}></CustomButton>
    </div>
  </div>
}