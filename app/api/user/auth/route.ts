import { UserProfile } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../mongodb";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";

export const GET = async (
  req:NextRequest,
) => 
{
  const {searchParams} = new URL(req.url)
  const code = searchParams.get('code')

  if (!code)
    return NextResponse.json({msg:'Code was not provided'}, {status:301})

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body : new URLSearchParams({
        grant_type:'authorization_code',
        code:code as string,
        redirect_uri: 'http://127.0.0.1:3000/callback'
      })
    });

    const data : {access_token?:string, token_type?:string, expires_in?:number,
      refresh_token:string
    } = await tokenRes.json()

    console.log(`Data: ${JSON.stringify(data, null, 3)} => ${tokenRes.status}`)

    if (!data.access_token)
      throw `Invalid code was given`

    // gather the user's profile information
    const userInfoResponse = await fetch('https://api.spotify.com/v1/me', {
      headers : {
        Authorization : `Bearer ${data.access_token}`
      },

      method: 'GET'
    })

    if (userInfoResponse.status != 200)
      throw `Failed to fetch user profile`

    const userInfo : UserProfile = await userInfoResponse.json();
    userInfo.access_token = data.access_token;
    userInfo.refresh_token = data.refresh_token;

    // check if the user already exists in the DB
    const userId = userInfo.id;
    const client = await clientPromise
    const db     = client.db('spotiart')
    const collection = db.collection<UserProfile>('users')
    const transactionsCollection = db.collection('transactions')
    await transactionsCollection.insertOne({time: new Date()})

    let isUserNew = (await collection.findOne({id : userId})) ? false : true;

    if (isUserNew)
    {
      // insert the user's information
      await collection.insertOne({
        ...userInfo,
        subscribed: false,
        results : []
      })
    } else 
    {
      // update the user information anyway
      await collection.updateOne(
        {id:userId},
        {
          $set : {
            ...userInfo,
          }
        }
      )
    }

    // create a JWT token for the user
    const payload = {
      id : userInfo.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: 60 * 60 * 24 * 30 * 5 // 5 months
    })

    console.log(`Creating new token for the user => ${token}`)


    // save the token in the cookies
    const cookiesStore = await cookies();
    cookiesStore.set('auth', token, {
      // expires: (60 * 60 * 24 * 30 * 5) - 5
    })
    
    console.log(`Exiting with code 200, everything is ok`)

    return NextResponse.json({
      user: userInfo,
      token : token,
      is_new : isUserNew,
      access_token: data.access_token
    })
    
  } catch(err)
  {
    return NextResponse.json({msg:`Error : ${err}`}, {status:302})
  }
  // return NextResponse.json({msg:`Your code is ${code}`})

}