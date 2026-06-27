import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { GetUserInfo, InsertAnalysis, RefreshAccessToken, UpdateLastAnalysis, UpdateTokens, VerifyUser } from "../middleware";
import { TopTracksResult } from "@/app/types";
import clientPromise from "../../mongodb";
import { redirect } from "next/navigation";

const DEV_MODE = process.env.DEV_MODE == 'TRUE';


function generateRandomName()
{
  const parts = [
    "Pickle",
    "McFluff",
    "Banana",
    "Waffles",
    "Snorlax",
    "Giggles",
    "Tofu",
    "Noodle",
    "Cupcake",
    "Zigzag",
    "Bubbles",
    "Spaghetti",
    "Marshmallow",
    "Churro",
    "Pancake",
    "Socks",
    "Sprinkles",
    "Muffin",
    "Cheeseball",
    "Doodle"
  ];
  const len = parts.length;
  const nParts = 2
  let result:string[] = []

  for(let i=0;i<nParts;++i)
  {
    let choosenName = ''
    while(true)
    {
      choosenName = parts[Math.floor(Math.random() * parts.length)];

      if (! result.includes(choosenName))
        break;
    }

    result.push(choosenName)
  }

  return result.join(' ')
}

export async function _GET(req:NextRequest)
{
  const encoder = new TextEncoder();

  if (false)
    return NextResponse.json({msg:'test'}, {status:400})

  const stream = new ReadableStream({
    async start(controller) {
      function send(msg:string) {
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`))
      }

      send("Starting analysis...");
      await new Promise(r => setTimeout(r, 2000));

      send("All tracks loaded");
      await new Promise(r => setTimeout(r, 2000));

      send("All artists loaded");
      await new Promise(r => setTimeout(r, 2000));

      send("Analysis complete ✅");

      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    }
  })
}

// app/api/user/statistics/route.ts

// export async function GET() {
//   const cookiesStore = await cookies();
//   const auth = cookiesStore.get("auth")?.value;

//   const unauth_response = () =>
//     NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   if (!auth) return unauth_response();

//   const verifiedUser = await VerifyUser(auth);
//   if (!verifiedUser) return unauth_response();

//   const userInfo = await GetUserInfo(verifiedUser);
//   if (!userInfo) return unauth_response();

//   if (userInfo.results.length >= 3 && !DEV_MODE) {
//     return NextResponse.json(
//       { error: "User exceeded the allowed analysis for free tier" },
//       { status: 403 }
//     );
//   }

//   const now = Date.now();
//   if (userInfo.last_analysis && !DEV_MODE) {
//     const diff = now - new Date(userInfo.last_analysis).getTime();
//     const day = 1000 * 60 * 60 * 24;
//     if (diff < day) {
//       return NextResponse.json(
//         {
//           error: `The user has to wait ${Math.ceil(
//             (day - diff) / (1000 * 60 * 60)
//           )}h to run another analysis`,
//         },
//         { status: 429 }
//       );
//     }
//   }

//   const getTopItems = async (url:string) => {
//     const r = await fetch(url, {
//       headers: {
//         'Authorization' : `Bearer ${access_token}`
//       }
//     })

//     if (r.status != 200)
//     {
//       if (r.status == 401)
//       { 
//         if (!refresh_token)
//           throw `NO_REFRESH_TOKEN`

//         const refreshResult = await RefreshAccessToken(refresh_token)

//         if (!refreshResult)
//           throw `FAILED_TO_REFRESH_THE_TOKEN`

//         access_token = refreshResult.access_token;

//         console.log(`Updated the user's token : ${access_token}`)
        
//         await UpdateTokens(refreshResult.refresh_token??'', access_token, verifiedUser!);
//         return getTopItems(url)
//       }

//       console.log(`/api/user/statistics => ${r.status} : ${await r.text()}`)
//       return null;
//     }

//     const rJ : TopTracksResult = await r.json() as TopTracksResult;

//     return rJ;
//   }


//   // ✅ If we reach here, start SSE stream
//   const encoder = new TextEncoder();

//   const stream = new ReadableStream({
//     async start(controller) {
//       function send(msg: string) {
//         controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
//       }

//       try {
//         send("Starting analysis...");

//         // === Fetch top tracks ===
//         let allTracks: TopTracksResult = { items: [], next: "", prev: "" };
//         let url =
//           "https://api.spotify.com/v1/me/top/tracks?time_range=" +
//           process.env.TRACKS_TIME_RANGE;
//         let fetchCounter = 1;

//         while (true) {
//           const rJ = await getTopItems(url); // your helper
//           if (!rJ) break;
//           allTracks.items = [...allTracks.items, ...rJ.items];
//           if (!rJ.next) break;
//           url = rJ.next;
//           fetchCounter++;
//         }

//         send("All tracks loaded");

//         // === Fetch top artists ===
//         let artists: any = {};
//         let artistsNextUrl =
//           "https://api.spotify.com/v1/me/top/artists?time_range=long_term";

//         while (artistsNextUrl) {
//           const r = await fetch(artistsNextUrl, {
//             headers: { Authorization: "Bearer " + userInfo.access_token },
//           });
//           if (r.status !== 200) break;
//           const j = await r.json();
//           j.items.forEach((e: any) => {
//             artists[e.id] =
//               e.images.sort((a: any, b: any) => b.width - a.width).at(0)?.url ??
//               "";
//           });
//           if (!j.next) break;
//           artistsNextUrl = j.next;
//         }

//         send("All artists loaded");

//         // === Save analysis ===
//         const finalResponse = {
//           count: allTracks.items.length,
//           artists,
//           items: allTracks.items,
//         };

//         const newDate = new Date();
//         await UpdateLastAnalysis(userInfo.id, newDate);
//         await InsertAnalysis(userInfo.id, {
//           name: generateRandomName(),
//           date: newDate,
//           owner: userInfo.id,
//           owner_name: userInfo.display_name,
//           public: true,
//           share_details: { views: 0, likes: 0 },
//           ...finalResponse,
//         });

//         send("Analysis complete ✅");

//         controller.close();
//       } catch (err) {
//         send("Error during analysis: " + String(err));
//         controller.close();
//       }
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }


export async function GET()
{
  const cookiesStore = await cookies()
  const auth = cookiesStore.get('auth')?.value

  let unauth_response = () => {
    return NextResponse.json({
      error: `Unauthorized`,
    }, { status: 401 });
  }



  if (!auth)
    return unauth_response();

  let verifiedUser = await VerifyUser(auth)

  if (!verifiedUser)
    return unauth_response();

  let userInfo = await GetUserInfo(verifiedUser)

  if (!userInfo)
    return unauth_response();

  if (userInfo.results.length >= 3 && !DEV_MODE)
    return NextResponse.json({error: `User exceeded the allowed analysis for free tier`}, 
      {status:403})

  const now = new Date().getTime();

  if (userInfo.last_analysis && !DEV_MODE)
  {
    const diff = now - new Date(userInfo.last_analysis).getTime();
    const day = 1000 * 60 * 60 * 24
    if (diff < day) 
      return NextResponse.json({error:`The user has to wait ${Math.ceil((day - diff) / (1000 * 60 * 60))}h to run another analysis`}, 
        {status:429})
  }

  let { access_token, refresh_token } = userInfo;

  if (DEV_MODE)
  {
    // const client = await clientPromise;
    // const coll = client.db('spotiart').collection('users');
  }

  const getTopItems = async (url:string) => {
    const r = await fetch(url, {
      headers: {
        'Authorization' : `Bearer ${access_token}`
      }
    })

    if (r.status != 200)
    {
      if (r.status == 401)
      { 
        if (!refresh_token)
          throw `NO_REFRESH_TOKEN`

        const refreshResult = await RefreshAccessToken(refresh_token)

        if (!refreshResult)
          throw `FAILED_TO_REFRESH_THE_TOKEN`

        access_token = refreshResult.access_token;

        console.log(`Updated the user's token : ${access_token}`)
        
        await UpdateTokens(refreshResult.refresh_token??'', access_token, verifiedUser!);
        return getTopItems(url)
      }

      if (r.status == 429)
      { // Too many requests hit
        console.log(`/api/user/statistics => getTopItems => 429(Too many requests) => ${(Number.parseInt(r.headers.get('Retry-After')??'0') / 60 / 60).toFixed(2)}h`)
      }

      console.log(`/api/user/statistics => ${r.status} : ${await r.text()}`)
      return null;
    }

    const rJ : TopTracksResult = await r.json() as TopTracksResult;

    return rJ;
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let send = (msg:string) => {
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
      }

      let err = (msg:string) => {
        send('ERROR:'+msg);
        controller.close();
      }

      send('starting ...');

      let allTracks : TopTracksResult = {items:[], next:'', prev:''}
      let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=' + process.env.TRACKS_TIME_RANGE
      let fetchCounter = 1

      send('loading tracks ...')
      while(true)
      {
        let rJ : any = null;
        
        try {
          rJ = await getTopItems(url)
        } catch (error) {
          if (error == `NO_REFRESH_TOKEN`)
          {
            cookiesStore.delete('auth');
            return redirect('/')
          }

          return NextResponse.json({error}, {status:405}) 
        }

        if (!rJ)
          break;

        allTracks.items = [...allTracks.items, ...rJ.items]

        if (!rJ.next)
          break;

        url = rJ.next;
        fetchCounter++;
      }

      if (allTracks.items.length == 0)
        return err('No tracks found.')

      send('loading artists ...')

      const preData = allTracks.items.map(e => {
        if (!e.album) return null;
          try {
            return {
              name: e.name,
              id: e.id,
              img: e.album.images[0].url,
              release: e.album.release_date,
              album_type: e.album?.album_type,
              album_name: e.album?.name,
              popularity:e.popularity??0,
              artists : (e.album as any).artists.map((e:any) => { return {name:e.name, id:e.id} }),
              duration_ms : e.duration_ms,
              explicit: e.explicit,
            }
          } catch (error) {
            return null;
          }
        }
      ).filter(e => e != null);

      let artists:any = {};
      let artistsNextUrl = 'https://api.spotify.com/v1/me/top/artists?time_range=long_term'

      while (artistsNextUrl) {
        try {
          const r = await fetch(artistsNextUrl, {
            headers: {
              Authorization: 'Bearer ' + access_token
            }
          });
      
          if (r.status != 200)
            throw `FETCH_ERROR[${r.status}]`
      
          const j = (await r.json()) as {next?:string, items:{id:string, name:string, images:{url:string, width:number}[]}[]};
      
          j.items.map(e => {
            artists[e.id] = e.images.sort((a, b) => b.width - a.width).at(0)?.url ?? ''
          });
      

          if (!j.next) break;
          artistsNextUrl = j.next;

        } catch(error)
        {
          console.log(`/api/user/statistics => loading artists => ${error}`)
          break;
        }
      }

      send('calculating ...')

      const finalResponse = {
        count: allTracks.items.length,
        artists,
        items: preData,
      }

      const newDate = new Date();

      const dbInfo = {
        ...finalResponse,
        name: generateRandomName(),
        date: newDate,
        owner: userInfo.id,
        owner_name: userInfo.display_name,
        public: true,
        share_details: {
          views: 0,
          likes : 0,
        },
      }

      await UpdateLastAnalysis(userInfo.id, newDate);
      let insertedId = await InsertAnalysis(userInfo.id, dbInfo as any);

      send('FINISHED:' + JSON.stringify({
        name: dbInfo.name,
        id: insertedId,
        date: newDate
      }))

      controller.close();
    }
  })

  

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
  // return NextResponse.json({counter: fetchCounter, ...finalResponse}, {status:200})
}