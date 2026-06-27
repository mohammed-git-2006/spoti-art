import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { GetAccessTokenFor, VerifyUser } from "../middleware";



export async function GET(req:NextRequest) {
  const cookiesStore = await cookies();
  
  if (!cookiesStore.has('auth'))
    return NextResponse.json({msg:'Not logged in'}, {status:301})

  const auth = cookiesStore.get('auth')!.value as string;
  const verifiedUser = await VerifyUser(auth);

  if (!verifiedUser)
    return NextResponse.json({msg:'Unauthorized'}, {status:401})

  const accessToken = await GetAccessTokenFor(verifiedUser);

  // fetch the top tracks (short term)
  const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=2', {
    headers: {
      'Authorization' : `Bearer ${accessToken}`
    }
  });

  if (response.status != 200)
    return NextResponse.json({msg:'Server side error: ' + await response.text()}, {status:302})

  return NextResponse.json(await response.json(), {status:200})
} 