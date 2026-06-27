import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // ✅ this should give you "0" if you visit /api/user/statistics/0

  return NextResponse.json({ id });
}
