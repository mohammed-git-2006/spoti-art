'use client'

import { useRef } from "react"


export default function TestPage()
{
  const data = useRef([
    { name: 'Parliament', desc: 'Night Blue Ks 600 pcs', price: Math.floor(Math.random() * 30) + 35 },
    { name: 'Parliament', desc: 'Night Blue Ks 300 pcs', price: Math.floor(Math.random() * 30) + 35 },
    { name: 'Parliament', desc: 'Night Blue Ks 900 pcs', price: Math.floor(Math.random() * 30) + 35 },
    
    { name: 'Parliament', desc: 'Night Blue Ks 900 pcs', price: Math.floor(Math.random() * 30) + 35 },
    { name: 'Parliament', desc: 'Night Blue Ks 900 pcs', price: Math.floor(Math.random() * 30) + 35 },
    { name: 'Parliament', desc: 'Night Blue Ks 300 pcs', price: Math.floor(Math.random() * 30) + 35 },
    
    { name: 'Parliament', desc: 'Night Blue Ks 300 pcs', price: Math.floor(Math.random() * 30) + 35 },
    { name: 'Parliament', desc: 'Night Blue Ks 600 pcs', price: Math.floor(Math.random() * 30) + 35 },
    { name: 'Parliament', desc: 'Night Blue Ks 900 pcs', price: Math.floor(Math.random() * 30) + 35 },
  ]).current

  return (
    <div className="w-full h-full flex justify-center  bg-white text-black py-10">
      <div className="grid grid-cols-3">
        {data.map((e, i) => {
          return <div className="flex flex-col p-3 items-center border border-gray-200 group
          transition hover:border-gray-600 *:transition *:flex-1- *:-grow overflow-y-hidden
          gap-5 hover:gap-0 relative
          ">
            <img src='https://images.shopdutyfree.cn/image/upload/c_pad,f_auto,h_257,w_257/v1629216273/2690657/2690657_1_en_GB.jpg' 
            className="w-1/2 my-10"/>
            <div className="w-full font-bold"> {e.name} </div>
            <div className="w-full font-medium text-gray-600"> {e.desc} </div>
            <div className="w-full font-bold mb-2">${e.price}</div>
            <div className="absolute bg-black text-white text-center p-4 cursor-pointer
            bottom-3 left-3 right-3 translate-y-20 group-hover:translate-y-0 
            duration-500 opacity-0 group-hover:opacity-100 hover:scale-105 
            active:scale-95">
              Add to bag
            </div>
          </div>
        })}
      </div>
    </div>
  )
}