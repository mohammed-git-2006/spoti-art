import { NextRequest } from "next/server";
import clientPromise from "../api/mongodb";
import { SpotiArtResult, UserProfile } from "../types";
import { ObjectId } from "mongodb";
import AnalysisActionPage from "./action";
import { Panel } from "@/src/components/Panel";
import { cookies } from "next/headers";
import { VerifyUser } from "../api/user/middleware";
import { cache } from "react";

const loadAnalysisById = cache(async (id:string) => 
{
  const client = await clientPromise;
  const db = client.db('spotiart');
  const analysis = await db.collection<SpotiArtResult>('analysis').findOne({_id: new ObjectId(id)});

  return analysis;
})


export async function generateMetadata({searchParams} : {searchParams:any}) 
{
  const id = (await searchParams).id;

  let notFound = () => {
    return {
      title: 'Analysis not found | SpotiArt',
      description: 'The requested analysis does not exist.'
    };
  }

  if (!id) return notFound();

  const analysis = await loadAnalysisById(id)

  if (!analysis) return notFound();

  if (!analysis.public)
    return {title:`SpotiArt`, description:``}

  return {
    title: `${analysis.owner_name} | SpotiArt`,
    description: `Analysis of ${analysis.count} tracks, created on ${new Date(analysis.date).toDateString()}.`,
    openGraph: {
      title: `${analysis.owner_name} full Spotify analysis!`,
      description: `Analysis of ${analysis.count} tracks`,
      images: analysis.artists[0]?.image ? [analysis.artists[0].image] : [],
      url: `${process.env.BASE_URL}/analysis-view?id=${id}`,
      siteName:'SpotiArt',
      type:'website'
    },
    twitter: {
      card: "summary_large_image",
      title: `${analysis.owner_name} full Spotify analysis!`,
      description: `Analysis of ${analysis.count} tracks`
    }
  }
}



export default async function AnalysisViewPage({searchParams} : {searchParams:any})
{
  const id = (await searchParams).id

  if (!id)
  {
    return <div>
      The id is not provided, check if the link is correct
    </div>
  }

  let Error = ({children}:{children:any}) => {
    return (<div className="w-full h-dvh flex items-center justify-center">
      <Panel className="text-red-600 font-medium text-md p-10">
        <span className="font-bold">ERROR: </span> {children}
      </Panel>
    </div>)
  }

  const client = await clientPromise;
  const db = client.db('spotiart');
  const users     = db.collection<UserProfile>('users')
  const analysis  = db.collection<SpotiArtResult>('analysis')
  const docId = new ObjectId(id)

  const analysisDoc = await loadAnalysisById(id)

  if (!analysisDoc)
    return <Error>No document found for the analysis {id}</Error>

  // Check if the view does not come for the owner
  const cookiesStore = await cookies();
  let isOwner = false;
  let isUserLoggedIn = false;

  if (cookiesStore.has('auth'))
  {
    try {
      const userId = await VerifyUser(cookiesStore.get('auth')?.value!)

      if (userId && userId == analysisDoc.owner)
        isOwner = true;

      isUserLoggedIn = userId != null;
    } catch(error) {}
  }

  if (!analysisDoc.public && !isOwner)
    return <Error>This document is not yet public</Error>

  const ownerInfo = await users.findOne({id: analysisDoc.owner})

  if (!ownerInfo)
    return <Error>Server side error for the analysis {id}</Error>


  

  if (!isOwner) analysis.updateOne({_id: docId}, {
    $set: {
      share_details: {
        ...analysisDoc.share_details,
        views: analysisDoc.share_details.views + 1,
      }
    }
  })

  function serialize(doc: any) {
    return JSON.parse(JSON.stringify(doc, (key, value) => {
      if (key === "_id") return value.toString();       // ObjectId → string
      if (value instanceof Date) return value.toISOString(); // Date → string
      return value;
    }));
  }

  let stripOwner = (doc:UserProfile) => {
    return {
      display_name: doc.display_name,
      images: doc.images,
      followers: doc.followers,
    }
  }


  return (
    <AnalysisActionPage 
    info={serialize(analysisDoc)} 
    owner={stripOwner(serialize(ownerInfo)) as any}
    isOwner={isOwner}
    shareDetails={analysisDoc.share_details}
    isUserLoggedIn={isUserLoggedIn}
    />
  )
}