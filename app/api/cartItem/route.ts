import { prisma } from "@/app/lib/prisma";
import { CartItem } from "@prisma/client";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const {cartId} = await req.json()
    
        const cartItems = prisma.cartItem.findMany({
            where: { cartId },
            include: {
                book: true
            }
        })
    
        if (!cartItems) {
                        return NextResponse.json({ error: 'Cart items not found' }, { status: 404 });
                    }
    
        return NextResponse.json(cartItems, {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Couldn't reach declared cart items" },
            {status: 500}
        )
    }
}


export async function POST(req: NextRequest) {
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

        const {bookId} = await req.json()

        if (!bookId) {
            throw new Error("Book ID is missing.");
        }

        let cart = await prisma.cart.findUnique({
            where: { userId: user.id }
        })

        if(!cart) {
            cart = await prisma.cart.create({
                data: { userId: user.id }
            })
        }

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_bookId: {
                cartId: cart.id,
                bookId
            }}
        })

        let newCartItem: CartItem;

        if(existingItem) {
            newCartItem = await prisma.cartItem.update({
                where: {id: existingItem.id},
                data: {quantity: existingItem.quantity + 1}
            })
        } else {
            newCartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    bookId,
                    quantity: 1
                }
            })
        }

        return NextResponse.json(newCartItem, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Couldn't create declared cart item" },
            {status: 500}
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const {cartId, bookId, quantity} = await req.json()

        if (!cartId || !bookId) {
            return NextResponse.json(
                { error: "cartId and bookId are required." },
                { status: 400 }
            );
        }

        const updatedCartItem = await prisma.cartItem.update({
            where: {
                cartId_bookId: {
                    cartId,
                    bookId
                }
            },
            data: {
                quantity: quantity
            }
        })

        return NextResponse.json(updatedCartItem, {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Declared cart item can't be updated" },
            {status: 500}
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {cartId, bookId} = await req.json()

        if (!cartId || !bookId) {
            return NextResponse.json(
                { error: "cartId and bookId are required." },
                { status: 400 }
            );
        }

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_bookId: {
                    cartId,
                    bookId
                }
            }
        })

        if (!existingItem) {
            return NextResponse.json(
                { error: "Cart item not found." },
                { status: 404 }
            );
        }

        if(existingItem.quantity > 1) {
            const updatedCartItem = await prisma.cartItem.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity - 1
                }
            });

            return NextResponse.json(
                { message: `The quantity of the cart item has been reduced to ${updatedCartItem.quantity}.` },
                { status: 200 }
            );
        } else {
            await prisma.cartItem.delete({
                where: {
                    id: existingItem.id
                }
            });

            return NextResponse.json(
                { message: "The cart item has been successfully removed." },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Couldn't change quantity or remove the cart item" },
            {status: 500}
        )
    }
}