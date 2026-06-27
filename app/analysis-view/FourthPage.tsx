'use client'
import { useEffect, useRef } from "react";
import { SpotiArtResult, UserProfile } from "../types";
import { createTl } from "./timeline";
import { FaSpotify } from "react-icons/fa";
import CustomButton from "@/src/components/CustomButton";

export default function FourthPage({info, onDone, analytics, owner} : 
  {info:SpotiArtResult, onDone:()=> void, analytics:any, owner:UserProfile })
{
  let titleRef      = useRef(null);
  let containerRef  = useRef(null);
  let tracksRef     = useRef(null);
  let buttonRef     = useRef(null);

  useEffect(() => {
    const tl = createTl();

    tl.to(titleRef.current, {
      opacity:1,
    }).to((containerRef.current as any).children, {
      opacity:1,
      x: 0,
      stagger:0.2
    }).to('.tracks-container > *', {
      opacity:1,
      x: 0,
      stagger:0.05,
      // delay:0.5,
    }, '<').to(buttonRef.current, {
      opacity:1,
      x:0
    })
  }, []);

  const collapse = () => {
    const tl = createTl();

    tl.to(buttonRef.current, {
      opacity:0,
      x:window.innerWidth,
    }).to('.tracks-container > *', {
      opacity:0,
      stagger:{
        each:0.05,
        from:'end'
      },
    }, '<').to((containerRef.current as any).children, {
      opacity:0,
    }).then(_ => {
      onDone();
    });
  }


  let getArtistInfo = (name:string) => {
    for(let item of info.items){
      let i = item.artists.find(e => e.name == name)
      if (i) return i;
    }

    return null;
  }

  let getTracksFor = (name:string) => {
    let tracks = [];
    for(let item of info.items) {
      if (item.artists.find(e => e.name == name))
        tracks.push(item)
    }

    return tracks;
  }

  let finalData = useRef(Object.entries(analytics.artists).map(e => {
    return { info: getArtistInfo(e[0]), tracks: getTracksFor(e[0]) }
  }).filter(e => e.tracks.length > 1)).current

  let durationToMin = (duration:number) => {
    let m = duration / 1000 / 60;
    let ms = Math.floor(m);
    let r = Math.floor(((m*100) % 100) / (100 / 60));
    let rs = r.toFixed(0)
    return `${ms}:${rs.length == 1 ? '0' + rs : rs}`
  }

  let ExplicitTag = () => {
    return <div className="animate-pulse border-2 border-white/60 p-0.5 text-center box-border text-[0.5rem] uppercase rounded-sm">
      explicit
    </div>
  }

  return (
    <div className="w-full flex flex-col flex-1 items-center overflow-y-scroll">
      <div className="text-xl font-bold mt-10 mb-7 opacity-0" ref={titleRef}>Top Artists you listened for</div>

      <div ref={containerRef} className="w-full lg:grid-cols-2 not-lg:grid-cols-1 grid gap-4 *:opacity-0">
        {finalData.map((e, i) => {
          if (i >= 10) return <></>
          let imgSrc = e.info ? ((info.artists[e.info.id as any] ?? '') as any) : '';

          if (!imgSrc) imgSrc = e.tracks.at(0)?.img??''

          let topTracks = new Array(5).fill(null).map((_, i) => {
            return e.tracks[i]
          })
          
          return <div className="w-full flex flex-col gap-0 p-4 items-center">
            <div className="w-7/8 flex flex-col items-center relative">
              <div className="relative lg:w-1/2 not-lg:w-3/4 h-96 group overflow-hidden">
                <img src={imgSrc} alt={imgSrc ? imgSrc : e.info?.name} className="rounded-lg w-full 
                brightness-75 group-hover:brightness-100  transition" />
                <div className="absolute bottom-3 -translate-x-40 group-hover:translate-x-3 transition-all font-bold tracking-wider
                text-shadow-blac/20 "> {e.info?.name} </div>
              </div>
            </div>
            <div className="font-bold tracking-wide text-center mb-5 mt-2">
               {e.info?.name} <span className="text-green-500">#{i+1}</span>
              <span> (<span className="underline">{e.tracks.length}</span> tracks) </span>
            </div>
            <div ref={tracksRef} className="tracks-container divide-white/20 divide-y-2 divide-dashed w-full flex flex-col gap-0 *:opacity-0 *:-translate-x-500 overflow-x-hidden">
              {topTracks.map((e, i) => {
                return <div className='w-full flex flex-row gap-3 py-2'>
                  <img src={e.img} className="w-15 rounded-lg" />
                  <div className="h-full flex-1 flex flex-col justify-between">
                    <div className='tracking-wide font-medium flex flex-row items-center gap-3'>
                      <div>{e.name}</div>
                      {e.album_name && <div className="border rounded-sm uppercase px-1 text-emerald-500 text-[0.5rem] p-0.5">{e.album_name}</div>}
                      {e.explicit && <ExplicitTag/>}
                    </div>
                    <div className='text-green-400'>
                      {durationToMin(e.duration_ms)}
                    </div>
                  </div>
                  <div className="flex items-center cursor-pointer" onClick={() => {
                    window.open(`https://open.spotify.com/track/${e.id}`)
                  }}>
                    <FaSpotify className="text-green-500" size={20}/>
                  </div>
                </div>
              })}
            </div>
          </div>
        })}
      </div>

      <div className="mb-30 opacity-0 translate-x-full" ref={buttonRef}>
        <CustomButton onClick={collapse} />
      </div>
    </div>
  );
}
