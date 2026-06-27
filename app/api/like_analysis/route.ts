import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/app/api/mongodb";
import { SpotiArtResult } from "@/app/types";
import { ObjectId } from "mongodb";
import { GetUserInfo, VerifyUser } from "../user/middleware";

interface LikeObject {
  by: string;
  analysis_id: ObjectId;
  at: Date;
}

export async function GET(req:NextRequest)
{
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id)
    return NextResponse.json({error: 'Required fields were not passed'}, {status:400})

  if (id.length != 24)
    return NextResponse.json({error:'Illegal Request'}, {status:403});

  const cookiesStore = await cookies();
  const auth = cookiesStore.get('auth');
  let unauth = NextResponse.json({error:`Unauthorized`}, {status:401});

  if (!auth)
    return unauth

  const verifiedUser = await VerifyUser(auth.value);

  if (!verifiedUser)
    return unauth

  
  try {
    const _id = new ObjectId(id)
    const client = await clientPromise;
    const db = client.db('spotiart');
    const analysisCollection = db.collection<SpotiArtResult>('analysis');
    const analysisDoc = await analysisCollection.findOne({_id});
  
    if (!analysisDoc)
      return NextResponse.json({error:'Document not found'}, {status:404});

    if (analysisDoc.owner == verifiedUser)
      return NextResponse.json({message:'negative - owner'});

    const likesCollection = db.collection<LikeObject>('likes');

    if (!await likesCollection.findOne({
      $and: [
        {by: verifiedUser},
        {analysis_id: _id}
      ]
    }))
    {
      await analysisCollection.updateOne(
        {_id}, 
        { $inc: { 'share_details.likes' : 1 } }
      );

      await likesCollection.insertOne({
        by: verifiedUser,
        analysis_id: _id,
        at: new Date()
      });

      return NextResponse.json({message:'positive'})
    } else 
    {
      return NextResponse.json({message:'negative'})
    }

  } catch (error) {
    return NextResponse.json({error:'Internal server error + '}, {status:500})
  }
}