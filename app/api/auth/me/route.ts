import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get("token")?.value

    if(!token) {
        return NextResponse.json({isAuthenticated: false})
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!)
        return NextResponse.json({isAuthenticated: true})
    } catch (error) {
        return NextResponse.json({isAuthenticated: false})
    }
}