import { prisma } from "@/app/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get("token")?.value
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

    if(!token) {
        return NextResponse.json({isAuthenticated: false, user: null}, {status: 401})
    }

    try {
        const {payload} = await jwtVerify<{email: string}>(token, JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: {email: payload.email},
            select: { id: true, name: true, email: true, role: true }})

        if (!user) {
            return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
        }

        return NextResponse.json({
            isAuthenticated: true, 
            user}, 
            {status: 200})
    } catch (error) {
        return NextResponse.json({isAuthenticated: false, user: null}, {status: 401})
    }
}