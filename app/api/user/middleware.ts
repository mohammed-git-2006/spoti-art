import jwt from 'jsonwebtoken'
import clientPromise from '../mongodb';
import { SpotiArtResult, TopTracksResult, UserProfile } from '@/app/types';


export async function RefreshAccessToken(refresh_token:string) : Promise<{refresh_token?:string, access_token:string}|null>
{
  const url = 'https://accounts.spotify.com/api/token';

  const r = await fetch(url, {
    method:'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id : (process.env.SPOTIFY_CLIENT_ID as string),
      client_secret : (process.env.SPOTIFY_CLIENT_SECRET as string),
    })
  });

  const j = await r.json();

  if (r.status != 200)
  {
    console.log(`[middleware.ts] RefreshAccessToken : status [${r.status}] => Content : \n${JSON.stringify(j, null, 2)}`)
    return null;
  }


  return j;
} 

export async function UpdateTokens(refresh_token:string, access_token:string, id:string) : Promise<void> {
  const client = await clientPromise;
  const col = client.db('spotiart').collection('users');

  await col.updateOne({id}, {
    $set: {
      refresh_token,
      access_token
    }
  });

  return;
}

export async function VerifyUser(auth:string) : Promise<string|null> {
  try {
    const payload = await jwt.verify(auth, process.env.JWT_SECRET as string);
    if (!payload) throw undefined;
    return (payload as {id:string}).id;
  } catch(_)
  {
    return null;
  }
}

export async function GetUserInfo(id:string) : Promise<UserProfile|null> {
  try {
    const client = await clientPromise;
    const users  = client.db('spotiart').collection<UserProfile>('users');
  
    const userInfo = await users.findOne({id});
  
    if (!userInfo)
      return null;
  
    return userInfo as UserProfile;
  } catch (error) {
    console.log(`[E] [middleware.ts] GetUserInfo(id:${id}) => ${error}`)
    return null;
  }
} 

export async function InsertAnalysis(id:string, result:SpotiArtResult) : Promise<string|null>
{
  try {
    const client = await clientPromise;
    const db = client.db('spotiart')
    const analysis = db.collection<SpotiArtResult>('analysis');
    const users    = db.collection<UserProfile>('users');
    
    const {insertedId} = await analysis.insertOne(result);
    
    await users.updateOne({id}, {
      $addToSet: {
        results: {id: insertedId, name: result.name, date: result.date}
      }
    })

    return insertedId.toString();
  } catch(error) {
    console.log(`[E] [middleware.ts] InsertAnalysis(id:${id}) => ${error}`)
    return null;
  }
}

export async function UpdateLastAnalysis(id:string, time:Date) : Promise<boolean> {
  try {
    const client = await clientPromise;
    const users = client.db('spotiart').collection<UserProfile>('users');

    await users.updateOne({id}, {
      $set: {
        last_analysis: time    
      }
    })

    return true;
  } catch(error) {
    console.log(`[E] [middleware.ts] GetUserInfo(id:${id}) => ${error}`)
    return false;
  }
}

export async function GetAccessTokenFor(id:string) : Promise<string|null> {
  return (await GetUserInfo(id))?.access_token??null
}

export async function GetTokensFor(id:string) : Promise<{refresh_token:string|null, access_token:string}|null>
{
  const d = await GetUserInfo(id);

  if (!d) return null;

  return {
    access_token: d.access_token,
    refresh_token: d.refresh_token
  }
}