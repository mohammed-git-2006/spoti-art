'use client'

import { useEffect, useRef, useState } from "react"
import { AnalysisIdentifier, UserProfile } from "../types"
import {Panel, PanelHeader} from "@/src/components/Panel"
import gsap from 'gsap'
import { AnimatedButton } from "@/src/components/AnimatedButton"
import {FaEye, FaHeart, FaMagic, FaClock} from 'react-icons/fa'
import AalysisViewLayout from "../analysis-view/layout"

function NavBar({user} : {user:UserProfile})
{
  const navRef = useRef(null)
  const panelRef = useRef(null)
  const avatarAnimationId = useRef(0)
  const avatarRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({defaults:{
      ease:'power3.out',
      duration:.5
    }})

    tl.fromTo(navRef.current, {
      opacity:0,
      y:-200,
      scale:1
    }, {
      opacity:1,
      y:0,
      scale:1
    }).to((panelRef.current as any).children, {
      stagger: 0.2,
      opacity:1,
      y:0
    })
  }, [])

  useEffect(() => {
    const animate = () => {
      const tl = gsap.timeline({
        defaults: {
          ease:'power3.out',
          duration:.25
        }
      })

      tl.fromTo(avatarRef.current, {
        x:0,
        y:0
      },  {
        y: -10,
        scale:1.1
      }).to(avatarRef.current, {
        rotateZ:20,
      }).to(avatarRef.current, {
        rotateZ:-20,
      }).to(avatarRef.current, {
        rotateZ:0,
      }).to(avatarRef.current, {
        y:0,
        scale:1
      })
    }
  
    avatarAnimationId.current = window.setInterval(animate, 5000)
    animate()

    return () => {
      window.clearInterval(avatarAnimationId.current)
    }
  }, [])

  return <div ref={navRef} className="z-999 p-3 lg:p-3 w-full lg:w-1/2 opacity-0 sticky top-0 left-0 right-0">
    <Panel ref={panelRef} className=" w-full flex flex-row gap-3 invisible-scrollbar 
    overflow-x-scroll items-center justify-center *:opacity-0">
      <div ref={avatarRef} className="h-full"><img src={user.images[0].url} className="w-12 object-fit border border-white/20 rounded-full" /></div>
      <div className="flex-1 h-full flex-col justify-between">
        <div className="text-sm font-medium tp" >
          <span className="mr-2">{user.display_name}</span>
          <span className="bg-white text-black rounded-lg px-1 py-0.5 text-xs font-bold">{user.type}</span>
        </div>
        <div className="text-xs font-light ts"  >{user.email}</div>
        <div className="text-xs font-light ts mt-2">
          <span className="tp font-bold mr-1">{user.followers?.total}</span> 
          {user.followers?.total??0 > 1 ? 'follower' : 'followers'}
        </div>
      </div>
      <div>
        <button className="p-2 bg-white text-black text-xs font-bold rounded-lg text-center
        transition hover:scale-105 aria-pressed:scale-95"
        onClick={()=> {
          navigator.clipboard.writeText(user.access_token)
        }}
        >
          COPY
        </button>
      </div>
    </Panel>
  </div>
}


export function Switch({onChanged, value} : {onChanged:(v:boolean) => void, value:boolean}) {

  return (
    <button
      onClick={() => { onChanged(!value) }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 pr-0 border-green-500 bg-transparent transition-colors`}
      value={value ? 'true' : 'false'}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
          value ? "translate-x-6 bg-green-500" : "translate-x-1 bg-green-500/40"
        }`}
      />
    </button>
  );
}

function AnalysisWidget({info} : {info:AnalysisIdentifier}) {

  const [shareData, setShareData] = useState<{likes:number, views:number, public:boolean}>();
  const [err, setErr] = useState('')
  const [isPublic, setPublic] = useState(false)

  useEffect(() =>{
    fetch('/api/user/analysis-view?id=' + info.id).then(r => {
      if (r.status != 200)
        return setErr('Error loading share data from the server side');

      r.json().then(j => {
        setShareData(j);
        setErr('')
      })
    }).catch(err => {
      setErr('Failed to load share data')
    })
  }, [])

  useEffect(() => {
    if (!shareData) return;

    setPublic(shareData.public);
  }, [shareData])

  let copyLink = () => {
    window.navigator.clipboard.writeText(`https://www.spotiart.com/share/analysis/${info.id}`)
  }

  return <div className="bg-[var(--bg)] p-3 rounded-lg mt-1 flex flex-col gap-2">
    <div className="flex flex-row justify-between items-center">
      <div className="font-bold flex flex-row gap-3 items-center">
        <FaMagic size={15}/>
        <span>{info.name}</span>
      </div>
      <div className="font-light text-xs flex flex-col">
        {/* <div>{info.id.toString()}</div> */}
        <div className="text-indigo-200">{new Date(info.date).toLocaleDateString('en-GB')}</div>
      </div>
    </div>
    <div className="flex flex-row gap-3">
      <AnimatedButton className="text-xs p-0 active:scale-100" onClick={copyLink}>
        Copy link
      </AnimatedButton>
      <AnimatedButton className="text-xs p-0 active:scale-100" onClick={() => {
        window.open('/analysis-view?id=' + info.id.toString())
      }}>
        See full analysis
      </AnimatedButton>
      <div className="flex-1"></div>
      <div className="flex flex-row items-center gap-2 text-xs">
        <div> {isPublic ? 'Public' : 'Private'} </div>
        <Switch value={isPublic} onChanged={(v) => {
          setPublic(v);

          fetch('/api/user/analysis/change_visibility?id=' + info.id + '&state=' + (v ? 't' : 'f'))
        }} />
      </div>
    </div>
    {!err && shareData && 
    <div className="flex flex-row gap-5 text-sm">
      <div className="flex flex-row items-center gap-3 text-gray-400">
        Views: {shareData.views} <FaEye/>
      </div>
      <div className=" flex flex-row items-center gap-3 text-gray-400">
        Likes: {shareData.likes} <FaHeart/>
      </div>
    </div>
    }
  </div>

}

export default function HomePage(
  {user} : {user:UserProfile}
)
{
  let calcDiff = () => {
    return (Date.now() - new Date(user.last_analysis).getTime()) / 1000 / 60 / 60
  }

  const panelRef = useRef(null);
  const [analysisStatus , setAnalysisStatus] = useState<'off'|'on'|'disabled'|'loading_tracks'|'loading_artists'|'calculating'>('off')
  const [lastAnalysisDiff, setLastAnalysisDiff] = useState(calcDiff());
  const timeIntervalId = useRef<any>(0)
  const [eventMsg, setEventMsg] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(user.results)

  useEffect(() => {
    const tl = gsap.timeline({defaults:{ease:'power3.out', duration:.5}})
    
    tl.fromTo(panelRef.current, {
      opacity:0,
      x:-window.innerWidth
    }, {
      opacity:1,
      x:0
    })
    .to((panelRef.current as any).children, {
      stagger:0.2,
      opacity:1
    });

    timeIntervalId.current = setInterval(() => {
      let diff = calcDiff();
      setLastAnalysisDiff(diff);

      if (diff < 24)
      {
        // setAnalysisStatus('disabled')
      }
    }, 1000)

    return () => {
      clearInterval(timeIntervalId.current)
    }
  }, [])

  let startAnalysis = () => {
    if (analysisStatus == 'on' || analysisStatus == 'disabled')
      return;

    fetch('/api/user/statistics').then(async r => {
      if (r.status != 200)
      {
        setError('Failed to start analysis. Try again later.')
        let c = await r.json();
        console.log(`Status not 200 : ${JSON.stringify(c)}`);
        return;
      }

      const evtSource = new EventSource("/api/user/statistics");

      setAnalysisStatus('on')

      evtSource.onmessage = (event) => {
        let d = event.data as string;

        console.log(`onmessage => ${d}`)

        if (d.startsWith('FINISHED:'))
        {
          let jsonT = d.split('FINISHED:')[1]
          let jsonD = JSON.parse(jsonT)

          evtSource.close();
          setEventMsg('Done!');

          setResults([...results, jsonD])

          setInterval(() => {
            setAnalysisStatus('off')
          }, 2000)
          return;
        }

        if (d.startsWith('ERROR:'))
        {
          const errorD = d.split('ERROR:')[1];

          if (errorD == 'Redirect')
          {
            evtSource.close();
            fetch('/api/user/logout').then(_ => {
              window.location.pathname = '/';
            })
            
            return;
          }
          
          setEventMsg('Error encountered');
          
          setInterval(() => {
            setAnalysisStatus('off')
          }, 2000)

          setError(errorD);
          evtSource.close();

          return;
        }

        setEventMsg(d)
        setError('')
      };

      evtSource.onerror = (error) => {
        setEventMsg('Error triggered while doing analysis')
        setError('Failed to start analysis process. Try again later.');
        console.log(error)
        setInterval(() => {
          setEventMsg('');
          setAnalysisStatus('off')
        }, 2000)
        evtSource.close();
      };

    })
  }
  
  return (
    <div className="w-full flex flex-col gap-2 items-center relative">
      <div className="absolute top-0 left-0 z-0 w-full h-dvh">
        {/* <Background /> */}
      </div>

      <div className="flex flex-col h-auto w-full gap-2 z-999 items-center">
        <NavBar user={user} />

        <div ref={panelRef} className="w-full grid lg:grid-cols-2 not-lg:grid-cols-1 p-2 gap-2 lg:p-3 lg:gap-3 opacity-0
        *:opacity-0">
          <Panel className="h-[500px]"  animationOptions={{delay:0.25}}>
            <PanelHeader>Dashboard</PanelHeader>

            <div className="flex h-full flex-col gap-1">
              <div>Last Analysis:  <span className="text-emerald-500 font-mono font-bold">{new Date(user.last_analysis).toLocaleString('en-GB')}</span></div>
              <div>Total Analysis: <span className="text-emerald-500 font-bold">{user.results.length}</span></div>
              {/* <div>{Math.floor(lastAnalysisDiff / 60 / 60)}h</div> */}
              {lastAnalysisDiff > 0 && <div className="flex- items-center- gap-1- mt-5">
                * You have to wait <span className="text-emerald-500 font-bold">{Math.floor(24 - lastAnalysisDiff)}h</span> to run another analysis
              </div>}

              {error && <span className="text-red-500 font-mono font-bold">{error}</span>}

              {analysisStatus != 'disabled' && <div className="flex-1 flex items-center justify-center">
                <div className="bg-transparent border-2 border-green-500
                rounded-full w-50 h-50 flex justify-center items-center cursor-pointer group
                transition hover:scale-105 active:scale-95 relative overflow-hidden
                *:transition flex-col" onClick={startAnalysis}>
                  <span className="absolute top-0 left-0 w-full h-full z-0 
                  bg-green-500 group-hover:scale-y-100 
                  scale-y-0 origin-top"></span>
                  <span className="z-10 tracking-wider font-bold text-green-500
                  group-hover:text-white mb-1 text-center">
                    {analysisStatus == 'off' && 'Run Analysis'}
                    {analysisStatus != 'off' && <span className="tp text-center">{eventMsg}</span> }
                  </span>
                  {analysisStatus == 'off' && <span className="z-10 uppercase tracking-wider font-medium text-white
                  border border-white rounded-sm p-1 text-xs 
                  group-hover:font-bold group-hover:border-2">FREE</span>}
                </div>
              </div>}

            </div>
          </Panel>

          <Panel  className="h-[500px] flex flex-col overflow-y-scroll" animationOptions={{delay:.25}}>
            <PanelHeader>All Analysis Results : </PanelHeader>
            <div className="p-1 bg-black/30 rounded-lg w-full flex-1 flex flex-col px-2">
              {results.length == 0 &&
              <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
                <div className="italic ts font-light">
                  You haven't run any analysis yet
                </div>
                {/* <AnimatedButton onClick={() => {

                }} className="text-xs">
                  Run your first analysis! <span className="bg-white text-black font-medium px-[5.5px] rounded-xl animate-pulse">FREE</span>
                </AnimatedButton> */}
              </div>}

              { results.length > 0 && 
              <div className="w-full flex-1 flex flex-col gap-2 p-0 overflow-y-scroll">
                {results.map((e, _) => {
                  return <AnalysisWidget info={e} />
                })}
              </div>}
           </div>
          </Panel>
        </div>

      </div>
    </div>
  )
}