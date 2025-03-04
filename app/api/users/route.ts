import { NextResponse } from "next/server"

export async function GET() {
    const data = {message: "GET books"}
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const data = {message: "POST books"}
    return NextResponse.json(data)
}