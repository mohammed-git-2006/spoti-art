'use client'

import React, { useEffect, useRef } from "react";
import gsap from 'gsap'


export function Panel(
  {children, className, ref, animated, animationOptions} : 
  {children?:React.ReactNode, className?:string, ref?:any, animated?:any,
    animationOptions?:{
      duration?:number;
      ease?:string;
      delay?:number;
      stagger?:number;
    }
  })
{
  const localRef = useRef(null)
  useEffect(() => {
    if(animated)
    {
      gsap.to((localRef.current as any).children, {
        duration:0.25,
        ease:'power3.out',
        delay:0.0,
        stagger:0.25,
        ...(animationOptions??{}),
        opacity:1,
        x:0,
      })
    }
  }, [])

  return (
    <div ref={ref??localRef} className={"border border-white/10 p-3 rounded-xl backdrop-blur-md bg-white/10 " + 
      "  " + className + ' ' + (animated ? '*:opacity-0 *:-translate-x-125 overflow-x-hidden' : '')
    }>
      {children}
    </div>
  )
}

export function PanelHeader(
  { children } : { children? : React.ReactNode }
) 
{

  return (
    <div className="tp font-bold text-lg flex flex-row justify-start items-center mb-3 mt-0">
      {children}
    </div>
  )
}