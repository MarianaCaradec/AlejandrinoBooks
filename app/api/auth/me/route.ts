import { prisma } from "@/app/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = (await cookies()).get("token")?.value;

        if(!token) {
            console.error("No authentication token found.");
            return NextResponse.json({isAuthenticated: false, user: null}, {status: 401})
        }

        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
        const {payload} = await jwtVerify<{email: string}>(token, JWT_SECRET)

                const isTokenExpired = (exp?: number): boolean => {
                    if (!exp) return true;
                    return Math.floor(Date.now() / 1000) > exp;
                }  
        
                if (isTokenExpired(payload.exp)) {
                    return NextResponse.redirect("/login"); 
                }

        const user = await prisma.user.findUnique({
            where: {email: payload.email},
            select: { id: true, name: true, email: true, image: true, role: true }})

        if (!user) {
            console.error("User not found in database.");
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