'use client'

import { lazy, useEffect, useRef, useState } from "react"
import { SpotiArtResult, UserProfile } from "../types"
import { gsap } from "gsap"
import CustomButton from "@/src/components/CustomButton"
import CountUp from "@/src/bits/CountUp"
import CircularGallery from "@/src/bits/CircularGallery"
import { FaSpotify, FaChevronCircleRight } from 'react-icons/fa'
import Stepper from "@/src/components/Stepper"
import FinalPage from "./FinalPage"
// import UserDisplayPage from "./FirstPage"
// import SecondPage from "./SecondPage"
const UserDisplayPage = lazy(() => import('./FirstPage'))
const SecondPage      = lazy(() => import('./SecondPage'))
const ThirdPage       = lazy(() => import('./ThirdPage'))
const FourthPage      = lazy(() => import('./FourthPage'));
const FifthPage       = lazy(() => import('./FifthPage'));


function localAnalytics(info:SpotiArtResult)
{
  const artists:any = {} // TEMP: Because the spotify's end point /artist/{id} is locked down temporarly

  for(let item of info.items)
  {
    try {
      item.artists.forEach(e => {
        if (e.name in artists)
          artists[e.name] += 1;
        else 
          artists[e.name] = 1
      })
    } catch (error) {
      
    }
  }

  const itemsPerDuration = info.items.sort((a, b) => b.duration_ms - a.duration_ms).map(e => {
    return {name: e.name, img: e.img, duration: e.duration_ms}
  })

  let totalDuration = 0;

  info.items.forEach(e => {
    totalDuration += e.duration_ms / 1000.0;
  })


  const sortedData = (
    info.items
    .map(e => ({r:e.release?? null, i:e}))
    .filter(e => e.r != null)
    .map(e => {
      return {i:e.i, r: e.r!.split('-').length != 3 ? `${e}-01-01` : e.r};
    })
    .map(e => ({...e, d: new Date(e.r!)}))
    .sort((a, b) => b.d.getTime() - a.d.getTime())
    .map(e => ({...e, d: e.d.toLocaleDateString('en-GB')}))
    .filter(e => e.d != 'Invalid Date')
  )

  const splitData = () => {

    let format = (d:string) => {
      if (!d) return [0, 0]
      let v = Number.parseInt(d.split('/')[2]);
      return [Math.floor(v / 10) * 10, v];
    }

    let [mostModernFloor, mostModern]   = format(sortedData[0].d)
    let [oldestFloor, oldest]           = format(sortedData[sortedData.length-1].d)

    const stops = new Array((mostModernFloor - oldestFloor) / 10 + 1).fill(0).map((e, i) => oldestFloor + (i * 10))
    const refinedStops = [oldest, ...stops.copyWithin(0, 1, stops.length - 1) , mostModern]

    return {oldest, mostModern, refinedStops}
  }

  const splittedData = splitData();

  const getRenderData = () => {
    let getYear = (d:string) : number => {
      return Number.parseInt(d.split('/')[2])
    }

    const eras = {};
    const stops = splittedData.refinedStops;
    const bounds = [];

    for(let i=1;i<stops.length;++i)
    {
      bounds.push([stops[i-1], stops[i]]);
      (eras as any)[`${stops[i-1]}-${stops[i]}`] = 0//[];
    }

    for(let i of sortedData)
    {
      let y = getYear(i.d)
      for(let b of bounds)
      {
        if (y >= b[0] && y <= b[1])
          (eras as any)[`${b[0]}-${b[1]}`] += 1
      }
    }

    return {eras};
  }

  const renderData = getRenderData();

  const formatRenderData = () => {
    return Object.entries(renderData.eras).map(e => {
      return {
        name: e[0],
        'No. tracks': e[1],
      }
    });
  }

  const formattedRenderData = formatRenderData();
  const sorted2 = Object.entries(renderData.eras).sort((a:any, b:any) => b[1] - a[1])
  const _artists = Object.fromEntries(Object.entries(artists).sort((a:any, b:any) => b[1] - a[1]))


  return {
    artists:_artists,
    itemsPerDuration,
    totalDuration,
    sorted2,
    formattedRenderData,
  }
}


export default function AnalysisActionPage(
  {isUserLoggedIn, owner, info, isOwner, shareDetails} : 
  {isUserLoggedIn:boolean, isOwner:boolean, owner:UserProfile, info:SpotiArtResult,
    shareDetails:{likes:number, views:number}
  })
{
  const [page, setPage] = useState(0);
  const totalSteps = useRef(6).current
  const localAnalyticsResult = useRef(localAnalytics(info)).current



  return <div className="relative w-full h-dvh flex flex-col gap-2 invisible-scrollbar pt-10">
    <div className="z-999 absolute left-0 right-0 top-0 flex items-center justify-center p-4 bg-balck/20 backdrop-blur-sm">
      <Stepper setStep={setPage} currentStep={page} totalSteps={totalSteps} />
    </div>
    {page == 0 && <UserDisplayPage owner={owner} onDone={() => {
      setPage(page+1)
    }}/>}
    {page == 1 && <SecondPage info={info} owner={owner} analytics={localAnalyticsResult} onDone={() => {
      setPage(page+1)
    }}/>}
    {page == 2 && <ThirdPage info={info} analytics={localAnalyticsResult} onDone={() => {
      setPage(page+1)
    }}/>}
    {page == 3 && <FourthPage owner={owner} info={info} analytics={localAnalyticsResult} onDone={() => {
      setPage(page+1)
    }}/>}
    {page == 4 && <FifthPage owner={owner} info={info} analytics={localAnalyticsResult} onDone={() => {
      setPage(page+1)
    }}/>}
    {page == 5 && <FinalPage 
    shareDetails={shareDetails}
    isUserLoggedIn={isUserLoggedIn}
    analytics={localAnalyticsResult}
    info={info}
    isOwner={isOwner} owner={owner}/>}
  </div>
}