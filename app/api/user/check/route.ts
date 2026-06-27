import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import jwt from 'jsonwebtoken'

export async function GET(req:NextRequest) {
  // get the cookies store
  const cookiesStore = await cookies();

  // check if the auth exists in the cookie
  if (!cookiesStore.has('auth'))
    return NextResponse.json({msg:'User not logged in'}, {status:301})

  // get the token and initialize the user info
  const token : string = cookiesStore.get('auth')!.value;
  let userId = ''

  // validate the token
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET as string)!;

    if (!payload)
      throw `The payload was not verified`

    userId = (payload as {id:string}).id;
  } catch(err)
  {
    return NextResponse.json({msg:'Unauthorized'}, {status:401});
  }

  return NextResponse.json({msg:'OK'}, {status:200})

}