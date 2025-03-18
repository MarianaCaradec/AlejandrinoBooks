import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose";

const PROTECTED_ROUTES = ["/profile", "/admin"]
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value
    const isProtected = PROTECTED_ROUTES.includes(req.nextUrl.pathname)
    
    if(!token && isProtected) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    if(token) {
        try {
            jwtVerify(token, JWT_SECRET)
            return NextResponse.next()
        } catch (error) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

}

export const config = {
    matcher: ["/profile", "/admin"]
}