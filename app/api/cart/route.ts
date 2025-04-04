import { prisma } from "@/app/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = (await cookies()).get("token")?.value;

        console.log("Server-side request headers:", req.headers);
        if(!token) {
            console.error("No authentication token found.");
            return NextResponse.json({isAuthenticated: false, user: null}, {status: 401})
        }

        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
        const {payload} = await jwtVerify<{email: string}>(token, JWT_SECRET)
        console.log("Decoded payload:", payload);

        const isTokenExpired = (exp?: number): boolean => {
            if (!exp) return true;
            return Math.floor(Date.now() / 1000) > exp;
        }  

        if (isTokenExpired(payload.exp)) {
            return NextResponse.redirect("/login"); 
        }

        const user = await prisma.user.findUnique({
            where: {email: payload.email},
            select: { id: true, name: true, email: true, role: true }})

        if (!user || !user.id) {
        throw new Error("User authentication failed or user ID is missing.");
        }

        const cart = await prisma.cart.findUnique({
            where: {
                userId: user.id
            },
            include: {
                cartItems: true
            }
        })

        if (!cart) {
            return NextResponse.json({ items: [] }, { status: 200 }); 
        }

        return NextResponse.json({ cartItems: cart.cartItems }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch cart." },
            {status: 500}
        )
    }
}