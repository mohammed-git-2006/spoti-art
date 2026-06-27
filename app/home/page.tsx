// 'use client'
import { cookies } from "next/headers"
import { UserProfile } from "../types"
import { redirect } from "next/navigation";
import HomePage from "./home";

export async function generateMetadata()
{
  return {
    title:'SpotiArt | Home Page',
  }
}

export default async function HomePageController()
{
  const cookiesStore = await cookies();

  if (!cookiesStore.has('auth'))
    // return <div>AUTH problem : {JSON.stringify(cookiesStore.getAll()) }</div>
    return redirect('/')

  const userResponse = await fetch('http://127.0.0.1:3000/api/user/profile?token='+encodeURIComponent((cookiesStore.get('auth')!.value) as string), {
    cache:'no-store'
  });

  if (userResponse.status != 200)
    if (userResponse.status == 401)
      return redirect('/')
    else
      return redirect('/')
      // return <div>User response : {userResponse.status} <br/> {await userResponse.text()} </div>
    // return redirect('/')

  const userInfo = await userResponse.json() as UserProfile;
  // userInfo.results = new Array(5).fill(undefined)

  return (
    <HomePage user={userInfo} />
  )
}