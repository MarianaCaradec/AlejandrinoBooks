import { prisma } from "@/app/lib/prisma";
import { DatabaseError } from "@/errorHandler";
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
            throw new DatabaseError("Cart not found.");
        }

        return NextResponse.json({ cartItems: cart.cartItems }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch cart." },
            {status: 500}
        )
    }
}

export async function DELETE(req: Request) {
    try {
      const { userId } = await req.json(); 
  
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing userId." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const userCart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!userCart) {
        console.error("No cart found for user:", userId);
        return new Response(
          JSON.stringify({ error: "No cart found for this user." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      await prisma.$transaction([
        prisma.cartItem.deleteMany({
          where: { cartId: userCart.id }
        }),
        prisma.cart.delete({
          where: { userId }
        })
      ])
  
      console.log("Cart items removed successfully for cartId:", userCart.id);
      return new Response(
        JSON.stringify({ message: "Cart cleared successfully." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error clearing cart:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }