'use client'

import React from "react"

export function AnimatedButton(
  {onClick, children, className} : {onClick:(e?:any) => void, 
  children?:React.ReactNode, className?:string}) {
  return (<button
  onClick={onClick}
  className="rounded-full backdrop-blur-lg border-2 border-green-500 text-green-500
    text-sm p-2 transition hover:text-black relative
    aria-pressed:scale-110 group overflow-hidden active:scale-95 hover:scale-105
    focus:outline-none
    "
  >
    <span className="absolute left-0 top-0 h-full w-full scale-x-0
      transition rounded-full ease-in-out duration-250
      group-hover:scale-x-100 z-0 origin-left 
    bg-green-500 inset-0">

    </span>
    <div className={"w-full flex flex-row gap-2 transition group-hover:text-black z-999 relative " + className}>
      {children}
    </div>
  </button>)
}