'use client'
import { Panel, PanelHeader } from "@/src/components/Panel";
import { SpotiArtResult, UserProfile } from "../types";
import { useEffect, useRef, useState } from "react";
import { FaThumbsUp, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'
import { createTl } from "./timeline";


export default function FinalPage(
  {isOwner, owner, analytics, shareDetails, isUserLoggedIn, info}: 
  {isOwner:boolean, owner:UserProfile, analytics:any,
    shareDetails:{likes:number, views:number},
    isUserLoggedIn:boolean, info:SpotiArtResult
  }
){
  const topArtist = useRef(Object.entries(analytics.artists)[0]).current
  const [likes, setLikes] = useState(shareDetails.likes)
  

  let likeAnalysis = () => {
    if (!isOwner)
    {
      if (!isUserLoggedIn) window.open('/') 
      else 
      {
        fetch('/api/like_analysis?id=' + info._id.toString()).then(r => {
          if (r.status != 200)
          {
            return;
          }

          r.json().then(j => {
            if (j.message == 'positive')
              setLikes(likes + 1)
          })
        })
      }
    }
  }

  useEffect(() => {
    const tl = createTl();

    tl.to('.title-container', {
      opacity:1
    }).to('.profile-container', {
      opacity:1
    }).to('.panel-container', {
      opacity:1
    }).to('.likes-container', {
      opacity:1
    }).to('.share-container', {
      opacity:1
    })
  }, [])

  return (
    <div className="w-full flex flex-col items-center mt-10 gap-5 px-5">
      <div className="title-container opacity-0 font-bold text-xl lg:w-1/2 not-lg:w-full text-center">
        This was <span className="font-bold text-emerald-500">{owner.display_name}</span>'s analysis.
      </div>
      {/* <code>
        <pre>{JSON.stringify({isOwner, isUserLoggedIn})}</pre>
      </code> */}
      <div className="profile-container opacity-0 max-w-64 rounded-full overflow-hidden">
        <img src={owner.images[0].url} />
      </div>
      <Panel className="lg:w-1/3 not-lg:w-full opacity-0 panel-container">
        <PanelHeader>Analysis's summary</PanelHeader>
        <div>
          Your era: <span className="text-emerald-500 font-bold">{analytics.sorted2[0][0]}</span>
        </div>
        <div>
          Top artist: <span className="text-emerald-500 font-bold">{topArtist[0]}</span>
        </div>
      </Panel>
      <div className="opacity-0 flex flex-col items-center gap-2 likes-container">
        <FaThumbsUp  
        onClick={likeAnalysis}
        size={35} className="text-emerald-500 hover:scale-110 transition active:scale-95"/>
        <span className="font-bold text-xl">{likes}</span>
      </div>
      <div className="opacity-0 flex flex-wrap justify-center items-center share-container gap-7">
        {[
          {icon:FaInstagram , name:'Instagram', color:'text-purple-500'}, 
          {icon:FaTwitter   , name:'Twitter'  , color:'text-blue-500'}, 
          {icon:FaFacebook  , name:'Facebook' , color:'text-indigo-500'}
        ].map((e, i) => {
          let Icon = e.icon;
          return <div key={'share-cmp-'+i} className={e.color}><Icon size={30}/></div>
        })}
      </div>
    </div>
  )
}