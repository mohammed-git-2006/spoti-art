"use client"

import { RefObject, useEffect, useRef, useState } from "react";
import gsap from 'gsap'
import { GridScan } from "@/src/bits/GridScan";
import {Panel} from "@/src/components/Panel";
import ConnectSpotifyButton from "@/src/components/ConnectSpotifyButton";
import CustomButton from "@/src/components/CustomButton";
import CircularGallery from "@/src/bits/CircularGallery";
import SpotifyIcon from './spotify-logo.webp'
import Image from "next/image";
import Ferrofluid from "@/src/bits/Ferrofluid";
import { Background } from "@/src/components/Background";

const bgEnabled = false;

const ConnectPanel = ({ref} : {ref:RefObject<any>}) => {
  return <div ref={ref} className="opacity-0 w-4/5 lg:w-1/2 p-3 backdrop-blur-lg border border-white/20 rounded-lg
  flex flex-col bg-black/70 h-1/2 lg:h-50 flex flex-col gap-5">
    <div>
      Connect to your spotify
    </div>
  </div>
}

const NavBar = () => {
  const ref = useRef(null)

  useEffect(() => {
    gsap.to(ref.current, {
      duration:.8,
      ease:'power2.out',
      y:0,
      opacity:1
    })
  }, [])

  return (
    <div ref={ref} className="z-999 w-full sticky top-0 left-0 right-0 -translate-y-20 opacity-0 flex items-center justify-center">
      <Panel className="mt-5 w-full lg:w-2/3 flex flex-row justify-between items-center">
        <div className="h-full flex flex-row flex-1">
          <div className="tp font-medium uppercase- tracking-wide text-xl">
            Spoti Art
          </div>
        </div>
        {/* <ConnectSpotifyButton /> */}
      </Panel>
    </div>
  )
}

function FirstPage(
  {onNext} : {onNext:() => void}
) {
  const titleRef = useRef(null)
  const inTitleRef = useRef(null)
  const cardsContainer = useRef(null)
  const buttonRef = useRef(null)

  const cardTexts = [
    ["Relive the songs that defined your moments", '“Walk back through the songs that shaped your story.”'],
    ["See how your taste evolved", '“Trace how your sound matured, one beat at a time.”'],
    ["Rediscover hidden gems", '“Unearth forgotten tracks that once lit your world.”'],
  ]

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        duration:.5,
        ease:'power3.inOut'
      }
    })

    tl.fromTo(titleRef.current, {
      y:-window.innerHeight,
      opacity:0,
      scale:1
    }, {
      y:0,
      opacity:1,
      scale:1.3
    }).to(titleRef.current, {
      y: -0,
      scale:1.0
    }).to((inTitleRef.current as any), {
      opacity:1,
      // stagger:.5
    }).to(titleRef.current, {
      y:-50,
      scale:1.15
    }).to((cardsContainer.current as any).children, {
      stagger:.25,
      opacity:1,
      x:0,
      y:-18
    }, '-=0.5').to(buttonRef.current, {
      y:0
    }, '-=0.5')
  }, [])

  const scaffold = () => {
    const timeline = gsap.timeline({defaults:{
      duration:.5
    }})

    timeline.to(buttonRef.current, {
      y:500
    }).to((cardsContainer.current as any).children, {
      // y:0,
      // opacity:0,
      x:-window.innerWidth,
      stagger:.2,
    }).to(titleRef.current, {
      x:window.innerWidth
    }, '-=0.25').then(r => {
      onNext();
    })
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div ref={titleRef} className="text-3xl tracking-wide font-bold tp opacity-0 text-center">
        {/* Your Soundtrack, Rediscovered */}
        SpotiArt.com
        <div ref={inTitleRef} className="text-sm font-medium tracking-normal ts opacity-0 mt-3">
          <div>Your Soundtrack, Rediscovered</div>
          <div>Step into your musical universe</div>
        </div>
      </div>
      <div ref={cardsContainer} 
      className="w-full flex flex-row lg:flex-wrap 
      items--center justify--center gap-5  pt-5
      px-5 overflow-x-scroll *:opacity-0
      lg:w-2/3 lg:items-center lg:justify-center
      invisible-scrollbar
      lg:overflow-visible lg:overflow-y-visible
      "
      id="cards-container"
      >
        {[...cardTexts].map((e, i) => {
          return <div 
          // className="w-125 lg:w-1/3  backdrop-blur-lg p-4 flex flex-col gap-5 
          // bg-black/20 border
          // border-white/20 rounded-xl h-full lg:h-40 hide-sb translate-x-30 opacity-0
          // justify-between
          // "
          className="bg-black/10 backdrop-blur-lg border border-white/10 p-5
          min-w-60 flex flex-col justify-between sm:h-full- gap-5 
          rounded-lg transition hover:backdrop-blur-sm hover:bg-white/10 cursor-pointer"
          >
            <div className="text-lg tp font-bold">  {e[0]}</div>
            <div className="text-sm ts font-medium">{e[1]}</div>
          </div>
        })}
      </div>
      <div ref={buttonRef} className="w-2/3 flex flex-row justify-end mt-5 translate-y-[500px]">
        <CustomButton onClick={() => {
          scaffold();
        }} />
      </div>
    </div>
  )
}

function SecondPage({onNext} : {onNext:() => void}) {
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const cardsRef = useRef(null)
  const buttonRef = useRef(null)

  const samples = [
  {
    "name": "The Fate of Ophelia",
    "producer": "Taylor Swift",
    "image": "https://i.scdn.co/image/ab67616d0000b273-ophelia2026"
  },
  {
    "name": "Raindance",
    "producer": "Dave & Tems",
    "image": "https://i.scdn.co/image/ab67616d0000b273-raindance2026"
  },
  {
    "name": "Man I Need",
    "producer": "Olivia Dean",
    "image": "https://i.scdn.co/image/ab67616d0000b273-manineed2026"
  },
  {
    "name": "Ordinary",
    "producer": "Alex Warren",
    "image": "https://i.scdn.co/image/ab67616d0000b273-ordinary2026"
  },
  {
    "name": "Golden",
    "producer": "HUNTR/X, EJAE, AUDREY NUNA, REI AMI",
    "image": "https://i.scdn.co/image/ab67616d0000b273-golden2026"
  },
  {
    "name": "DtMF",
    "producer": "Bad Bunny",
    "image": "https://i.scdn.co/image/ab67616d0000b273-dtmf2026"
  },
  {
    "name": "Stateside",
    "producer": "PinkPantheress ft. Zara Larsson",
    "image": "https://i.scdn.co/image/ab67616d0000b273-stateside2026"
  },
  {
    "name": "Lush Life",
    "producer": "Zara Larsson",
    "image": "https://i.scdn.co/image/ab67616d0000b273-lushlife2026"
  },
  {
    "name": "End of Beginning",
    "producer": "Djo",
    "image": "https://i.scdn.co/image/ab67616d0000b273-endofbeginning2026"
  },
  {
    "name": "I Just Might",
    "producer": "Bruno Mars",
    "image": "https://i.scdn.co/image/ab67616d0000b273-ijustmight2026"
  },
  {
    "name": "BAILE INoLVIDABLE",
    "producer": "Bad Bunny",
    "image": "https://i.scdn.co/image/ab67616d0000b273-baileinolvidable2026"
  },
  {
    "name": "melodrama",
    "producer": "Disiz & Theodora",
    "image": "https://i.scdn.co/image/ab67616d0000b273-melodrama2026"
  },
  {
    "name": "iloveitiloveitiloveit",
    "producer": "Bella Kay",
    "image": "https://i.scdn.co/image/ab67616d0000b273-iloveit2026"
  },
  {
    "name": "SWIM",
    "producer": "BTS",
    "image": "https://i.scdn.co/image/ab67616d0000b273-swim2026"
  },
  {
    "name": "Choosin' Texas",
    "producer": "Ella Langley",
    "image": "https://i.scdn.co/image/ab67616d0000b273-choosintexas2026"
  },
  {
    "name": "Apt.",
    "producer": "ROSÉ & Bruno Mars",
    "image": "https://i.scdn.co/image/ab67616d0000b273-apt2026"
  },
  {
    "name": "EYES CLOSED",
    "producer": "JISOO & ZAYN",
    "image": "https://i.scdn.co/image/ab67616d0000b273-eyesclosed2026"
  },
  {
    "name": "Birds of a Feather",
    "producer": "Billie Eilish",
    "image": "https://i.scdn.co/image/ab67616d0000b273-birdsofafeather2026"
  },
  {
    "name": "Ring, Ring",
    "producer": "MIRA (Arabic)",
    "image": "https://i.scdn.co/image/ab67616d0000b273-ringring2026"
  },
  {
    "name": "melodie du soir",
    "producer": "Zaz (French)",
    "image": "https://i.scdn.co/image/ab67616d0000b273-melodiedusoir2026"
  }
]


  useEffect(() => {
    const tl = gsap.timeline({
      defaults:{
        duration:.75,
        ease:'power3.out'
      }
    })

    tl.fromTo(titleRef.current, {
      opacity:0,
      x:window.innerWidth,
    }, {
      opacity:1,
      x:0
    }).to(titleRef.current, {
      y:-0
    }).to(descriptionRef.current, {
      opacity:1,
    }).to(titleRef.current, {
      scale:1.1,
      y:-50
    }).to(cardsRef.current, {
      opacity:1
    }).to(buttonRef.current, {
      y:0,
    }, '-=0.5')
  }, [])

  const scaffold = () => {
    const tl = gsap.timeline({
      defaults:{
        duration:.75,
        ease:'power3.out'
      }
    })

    tl.to(buttonRef.current, {
      y: window.innerHeight
    }).to(cardsRef.current, {
      opacity:0,
    }, '-=0.5').to(titleRef.current, {
      x:-window.innerWidth
    }, '<').then(r => {
      onNext()
    })
  }

  return (
    <div className="w-full h-dvh flex items-center justify-center flex-col gap-4 overflow-hidden">
      <div ref={titleRef} className="text-2xl px-10 font-bold tp opacity-0 text-center">
        Your Musical Universe
        <div ref={descriptionRef} className="text-sm font-medium ts opacity-0 mt-4">
          Explore your artists, moods, and memories orbiting together.
        </div>
      </div>

       <div ref={cardsRef} className="w-full h-1/3 opacity-0">
         <CircularGallery
            items={samples.map((e, i) => {
              return {text:`${e.name}`, image:`/songs/${i+1}.png`}
            })}

            bend={0.75}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.05}
            fontUrl="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            font="bold 30px 'Open Sans'"
            scrollSpeed={5}
            />
       </div>

       <div ref={buttonRef} className="w-2/3 flex items-center justify-end translate-y-500">
          <CustomButton onClick={() => {
            scaffold()
          }} />
       </div>
    </div>
  )
}

function ThirdPage({uri} : {uri:string}) {
  const borderRef = useRef(null)
  const iconsContainer = useRef(null)

  const ICON_SIZE = 65;

  const generateIcons = () => {
    const icons: { x: number; y: number, rot:number }[] = [];

    const randInt = (r: number) => Math.floor(Math.random() * r);

    for (let i = 0; i < 35; i++) {
      let x = 0, y = 0, valid = false;

      while (!valid) {
        x = randInt(window.innerWidth);
        y = randInt(window.innerHeight);

        // check overlap
        valid = icons.every(icon => {
          const dx = icon.x - x;
          const dy = icon.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return dist > ICON_SIZE;
        });
      }

      icons.push({ x, y, rot : Math.floor(Math.random() * 70) - 35 });
    }

    return icons;
  };

  const scatteredIcons = useRef(generateIcons());


  useEffect(() => {
    const tl = gsap.timeline({
      defaults:{
        ease:'power3.out',
        duration:.5
      }
    })

    tl.fromTo(borderRef.current, {
      x:window.innerWidth,
      delay:.2,
    }, {
      x:0,
      opacity:1
    }, '+=0.5').to(borderRef.current, {
      scale:1.05
    }).to(borderRef.current, {
      y:-20
    }, '-=0.2').to((iconsContainer.current as any).children, {
      opacity:1,
      stagger:.15
    }).to((iconsContainer.current as any).children, {
      scale:1.6,
      stagger:.15,
    }, '-=4.0')
  }, [])

  return (
    <div className="w-full h-dvh flex flex-col items-center overflow-hidden p-10">
      <div ref={iconsContainer} className="w-full h-full absolute top-0 left-0 overflow-hidden">
        {scatteredIcons.current.map((e, i) => {
          return <div className={`p-4 rounded-full bg-transparent w-15 h-15 opacity-0
           absolute`}
           style={{
            transform: `translate(${Math.ceil(e.x)}px, ${e.y}px) rotate(${e.rot}deg)`
           }}
           >
            <Image src={SpotifyIcon} alt='' width={0} />
          </div>
        })}
      </div>
      <div className="not-lg:w-full lg:w-1/3  flex-1 flex items-center justify-center opacity-0" ref={borderRef}>
        <Panel className="w-full  p-4 flex flex-col gap-5 items-center justify-center">
          <div className="tp font-bold text-xl">
            Step Into Your Sound Galaxy
          </div>
          <div className="ts font-medium text-sm text-center mt-3 mb-8">
            Connect Spotify to unlock your story.
          </div>
          <div className="w-full flex items-center justify-center">
            <ConnectSpotifyButton onClick={() => {
              window.location.href = `https://accounts.spotify.com/authorize?client_id=b26800748d934e0d89c24aa04a9de7d1&response_type=code&redirect_uri=${encodeURIComponent(uri)}&scope=user-read-email,user-top-read`
            }} />
          </div>
        </Panel>
      </div>
    </div>
  )
}

const TEST_MODE = false

export default function StoryPage({redirectUri} : {redirectUri:string}) {
  const [part, setPart] = useState(2)

  return (
    <div className="w-full h-dvh flex flex-col relative">
      <div className="z-0 absolute top-0 left-0 w-full h-dvh">
        {bgEnabled && <Background />}
      </div>

      <div className="z-999 flex items-center justify-center w-full h-full">
        {part == 0 && <FirstPage onNext={() => {
          setPart(1)
        }} />}
        {part == 1 && <SecondPage onNext={() => {
          setPart(2)
        }} />}
        {part == 2 && <ThirdPage uri={redirectUri}/>}
      </div>
    </div>
  )
}
