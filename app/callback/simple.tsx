"use client"

import { useEffect, useState } from "react"

export default function SimpleCallbackPage({access_token} : {access_token:string}) 
{
  const [response, setResponse] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${access_token}` }
    }).then(r => {
      r.json().then(j => {
        console.log(j)
        setResponse(JSON.stringify(j, null, 2))
      }).catch(e => {
        setErr(e)
      })
    }).catch(e => {
      setErr(e)
    })
  }, [])

  return <div>
    {response ?? (err ?? 'UNKNOWN')}
  </div>
}