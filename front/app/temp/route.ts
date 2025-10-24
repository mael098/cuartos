import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json([Math.random() * 20 + 10, Math.random() * 20 + 10, Math.random() * 20 + 10]);
}
