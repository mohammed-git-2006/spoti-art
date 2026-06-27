"use client"

import {Panel} from "@/src/components/Panel";
import { useEffect, useState } from "react";

export default function CallbackActionPage({code} : {code:string})
{
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>()

  useEffect(() => {
    fetch('/api/user/auth?code='+encodeURIComponent(code)).then(async r => {
      if (r.status != 200)
      {
        setLoading(false);
        setErr('AUTH_PROBLEM')
        alert(`Failed to authorize: ${r.status} => ${await r.text()}`)
        // console.log(`Failed to authorize [${r.status}] => ${await r.text()}`)
        return;
      }

      r.json().then(j => {
        setLoading(false);
        setErr(undefined)
        console.log(`J => ${JSON.stringify(j, null, 2)}`)
        // alert(JSON.stringify(j))
        window.location.pathname = '/home'
      }).catch(e => {
        setLoading(false);
        setErr('PARSING_RESPONSE_PROBLEM')
      })
    }).catch(e => {
      setLoading(false);
      setErr('REQUEST_PROBLEM')
    })
  }, [])

  return (
    <div className="w-full h-dvh flex justify-center items-center p-6">
      <Panel className="w-full lg:w-1/2 min-h-30 flex items-center justify-center">
        <div className="font-light text-lg">{loading ? 'Checking credentials ...' : ''}</div>
        {!loading && err && <div className="font-medium text-lg text-red-500">
          Failed to authenticate, please try again later or contact the developer
          <br/>
          <span className="font-light text-sm">{err}</span>
        </div>}

      </Panel>
    </div>
  )
}