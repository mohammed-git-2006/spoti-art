import { NextRequest, NextResponse } from "next/server";
import { GetUserInfo, VerifyUser } from "../../middleware";
import { cookies } from "next/headers";
import { useErrorOverlayReducer } from "next/dist/next-devtools/dev-overlay/shared";
import clientPromise from "@/app/api/mongodb";
import { SpotiArtResult } from "@/app/types";
import { ObjectId } from "mongodb";


export async function GET(req:NextRequest)
{
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const state = searchParams.get('state');

  if (!id || !state)
    return NextResponse.json({error: 'Required fields were not passed'}, {status:400})

  if (!['f', 't'].includes(state))
    return NextResponse.json({error:'state can be either t or f'}, {status:400})

  const cookiesStore = await cookies();
  const auth = cookiesStore.get('auth');
  let unauth = NextResponse.json({error:`Unauthorized`}, {status:401});


  if (!auth)
    return unauth

  const verifiedUser = await VerifyUser(auth.value);

  if (!verifiedUser)
    return unauth

  const userInfo = await GetUserInfo(verifiedUser);

  if (!userInfo)
    return unauth;

  if (!userInfo.results.find(e => e.id.toString() == id))
    return NextResponse.json({error:'Illegal Request'}, {status:403})

  let nState = state == 't';

  try {
    const client = await clientPromise;
    await client.db('spotiart')
    .collection<SpotiArtResult>('analysis')
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: {
        public: nState
      } }
    )
  } catch (error) {
    return NextResponse.json({error:'Internal server error'}, {status:500});
  }

  return NextResponse.json({
    message: `OK`
  })
}