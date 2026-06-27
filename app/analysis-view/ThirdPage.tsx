'use client'

import { useEffect, useRef } from "react";
import { SpotiArtResult } from "../types";
import { createTl } from "./timeline";
import CustomButton from "@/src/components/CustomButton";

export default function ThirdPage({info, onDone, analytics} : 
  {info:SpotiArtResult, onDone:()=> void, analytics:any }
)
{
  const titleRef  = useRef(null);
  const buttonRef = useRef(null);
  const cardsRef  = useRef(null);
  
  useEffect(() => {
    const tl = createTl();

    tl.fromTo(titleRef.current, {
      opacity: 0,
      x: window.innerWidth,
      scale:0.8
    }, {
      x:0,
      opacity:1,
      scale:1.1
    }).to((cardsRef.current as any).children, {
      stagger: 0.2,
      opacity:1
    }).to(buttonRef.current, {
      opacity:1,
      x: 0,
    })
  }, [])

  const collapse = () => {
    const tl = createTl();
    
    tl.to(buttonRef.current, {
      opacity:0,
      x:window.innerWidth
    }).to((cardsRef.current as any).children, {
      stagger:{
        each:0.25,
        from:'end'
      },
      x:-window.innerWidth,
      opacity:0,
      scale:0.6,
      y:-400,
      ease:'power3.in'
    }, '<').to(titleRef.current, {
      opacity:0,
      x:window.innerWidth
    }).then( r => {
      onDone();
    })
  }

  const displayData = useRef(new Array(window.innerWidth < 1024 ? 8 : 9).fill(null).map((_, i) => analytics.itemsPerDuration[i])).current

  return <div className="w-full h-full overflow-y-scroll -invisble-scrollbar flex flex-col items-center gap-3">
    <div ref={titleRef} className="text-xl font-bold mt-10 mb-5 opacity-0">
      Longest tracks by duration
    </div>
    <div className="w-full grid lg:grid-cols-3 not-lg:grid-cols-2 px-5 lg:w-1/2 gap-3"
    ref={cardsRef}>
      {displayData.map((e:{name:string, img:string, duration:number}, i) => {
        let formatDuration = (duration:number) => {
          const d = duration / 1000.0
          const m = Math.floor(d/60/60)
          return `${Math.floor(d/60)}:${m > 10 ? m : '0' + m}`
        }

        return <div className="flex flex-col gap-2 opacity-0" key={'display-data-'+i}>
          <img src={e.img} className="rounded-xl" />
          <div className="w-full flex flex-row justify-between font-medium text-sm">
            <div className="font-bold tp">{e.name}</div>
            <div className="text-green-500">{formatDuration(e.duration)}</div>
          </div>
        </div>
      })}
    </div>
    <div className="w-full flex justify-center items-center opacity-0 translate-x-full" ref={buttonRef}>
      <CustomButton onClick={() => {
        collapse();
      }}></CustomButton>
    </div>
    <div className="mt-25"></div>
  </div>
}
