import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = "http://localhost:8080";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray?.join("/") || "";
  const url = new URL(request.url);
  const queryString = url.search;

  try {
    const response = await fetch(`${BACKEND_URL}/${path}${queryString}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy error for /${path}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch from backend" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray?.join("/") || "";
  const body = await request.json();

  try {
    const response = await fetch(`${BACKEND_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy error for /${path}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch from backend" },
      { status: 500 }
    );
  }
}
