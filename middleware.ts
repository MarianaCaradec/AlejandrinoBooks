import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken";

const PROTECTED_ROUTES = ["/profile", "/admin"]

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    const isProtected = PROTECTED_ROUTES.includes(req.nextUrl.pathname)

    if(!token && isProtected) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    if(token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET!)
        } catch (error) {
            return NextResponse.redirect(new URL('/signin', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/profile", "/admin"]
}