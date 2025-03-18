import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get("token")?.value

    if(!token) {
        return NextResponse.json({isAuthenticated: false, user: null}, {status: 401})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {email: string}
        
        const user = await prisma.user.findUnique({
            where: {email: decodedToken.email},
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