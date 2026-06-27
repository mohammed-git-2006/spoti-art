'use client'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { createTl } from './timeline'
import { SpotiArtResult, UserProfile } from '../types'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, Tooltip, XAxis, YAxis } from 'recharts'
import CustomButton from '@/src/components/CustomButton'

export default function FifthPage({info, onDone, analytics, owner} : 
  {info:SpotiArtResult, onDone:()=> void, analytics:any, owner:UserProfile })
{
  const titleRef = useRef(null)
  const buttonRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({defaults: {
      delay:0.2,
      duration:0.6,
      ease:'power3.out'
    }});

    tl.to('.title-container', {
      opacity:1,
    }).to('.info-container', {
      opacity:1,
    }).to(chartRef.current, {
      opacity:1,
    }).to(buttonRef.current, {
      opacity:1,
      x:0
    })
  }, [])

  const collapse = () => {
    const tl = createTl();

    tl.to(buttonRef.current, {
      opacity:0,
    }).to(chartRef.current, {
      opacity:0,
    }).to('.info-container', {
      opacity:0,
    }).to('.title-container', {
      opacity:0,
    }).then(r => {
      onDone();
    })
  }


  return <div className='w-full flex flex-col gap-2 items-center mt-10 overflow-x-hidden overflow-y-scroll'>
    <div className='title-container text-2xl font-bold opacity-0'>
      Life in Tracks
    </div>
    <div className="lg:w-1/2 not-lg:w-full p-4 flex flex-col gap-2 items-center">
      <div className='info-container opacity-0 not-lg:px-8 lg:px-16 flex flex-col'>
        <div className='flex flex-row gap-3 items-center *:cursor-pointer *:transition *:hover:scale-110 *:mx-0'>
          <span>Your Era : </span>
          <div className='font-medium text-emerald-500'> {analytics.sorted2[0][0]} </div>
          <div className='font-medium text-amber-500'> {(Math.floor((analytics.sorted2[0][1] as number)/info.items.length * 100))}% </div>
        </div>
      </div>

      <div className='h-auto w-full opacity-0' ref={chartRef}>
        <LineChart style={{ width: '100%',aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive
        data={analytics.formattedRenderData}>
          <CartesianGrid stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
          <XAxis
            dataKey="name"
            stroke="white"
            tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }}
          />
          <YAxis
            stroke="white"
            tick={{ fill: '#fff', fontSize: 14, fontWeight: 'bold' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#111', border: 'none', color: '#fff' }}
            cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line
            type="monotone"
            dataKey="No. tracks"
            stroke="green"
            strokeWidth={5}
            dot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </div>

      <div ref={buttonRef} className='opacity-0 translate-x-full'>
        <CustomButton
        onClick={collapse}
        />
      </div>
    </div>
  </div>
}