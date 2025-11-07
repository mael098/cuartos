import { getTemp } from "@/lib/arduino";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await getTemp();
    return NextResponse.json(data);
}



