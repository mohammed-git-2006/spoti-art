import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET()
{
  const cookiesStore = await cookies();

  cookiesStore.delete('auth');

  return NextResponse.json({message:'OK'}, {status:200})
}