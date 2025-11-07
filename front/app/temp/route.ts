'use server';

import { NextRequest, NextResponse } from "next/server";

const http = "http://192.168.3.34";

export async function GET() {
        const response = await fetch(`${http}/api/temp`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
    // return NextResponse.json([Math.random() * 20 + 10, Math.random() * 20 + 10, Math.random() * 20 + 10]);
}



