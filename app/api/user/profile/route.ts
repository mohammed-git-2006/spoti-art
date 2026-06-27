import { UserProfile } from "@/app/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import jwt from 'jsonwebtoken'
import clientPromise from "../../mongodb";

export async function GET(req:NextRequest, 
  {params} : {params:{token?:string}}
) {
  const {searchParams} = new URL(req.url)
  let token = searchParams.get('token')

  // get the cookies store
  if (!token) {
    const cookiesStore = await cookies();
  
    // check if the auth exists in the cookie
    if (!cookiesStore.has('auth'))
      return NextResponse.json({msg:'User not logged in'}, {status:301})
  
  
    // get the token and initialize the user info
    token = cookiesStore.get('auth')!.value;
  }

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


  // fetch the user data from the db
  try {
    const client = await clientPromise;
    const users = client.db('spotiart').collection<UserProfile>('users');

    const userInfo = await users.findOne({id: userId})

    if (!userInfo)
      throw `Error retrieving the user data from the db`

    return NextResponse.json(userInfo, {status:200})
  } catch(err)
  {
    return NextResponse.json({msg:err}, {status:301})
  }
}