import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../mongodb";
import { ObjectId } from "mongodb";
import { SpotiArtResult } from "@/app/types";


export async function GET(req:NextRequest)
{
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id')

  if (!id)
    return NextResponse.json({error: `Bad Request`}, {status:400})

  let client = await clientPromise;
  let doc = await client.db('spotiart').collection<SpotiArtResult>('analysis').findOne({_id: new ObjectId(id)})

  if (!doc)
    return NextResponse.json({error: `Document not found`}, {status:404})

  return NextResponse.json({
    views: doc.share_details.views,
    likes: doc.share_details.likes,
    public : doc.public,
  }, {status:200})
}