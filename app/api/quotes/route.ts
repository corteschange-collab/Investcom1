import { NextRequest, NextResponse } from "next/server";

const BASE = "https://brapi.dev/api";
const TOKEN = process.env.BRAPI_TOKEN ?? "";

export async function GET(req: NextRequest) {
  const tickers = req.nextUrl.searchParams.get("tickers");
  if (!tickers) return NextResponse.json({ results: [] });

  try {
    const url = new URL(`${BASE}/quote/${tickers}`);
    if (TOKEN) url.searchParams.set("token", TOKEN);
    url.searchParams.set("fundamental", "false");

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) return NextResponse.json({ results: [] });
    const data = await res.json();
    return NextResponse.json({ results: data?.results ?? [] });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
