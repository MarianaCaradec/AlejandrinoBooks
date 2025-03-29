import { prisma } from "@/app/lib/prisma";
import { fetchAuth } from "@/utils/fetchs";
import { CartItem } from "@prisma/client";
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
        const user = await fetchAuth()

        const {bookId} = await req.json()

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
        const {itemId, quantity} = await req.json()

        const updatedCartItem = prisma.cartItem.update({
            where: {
                id: itemId
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
        const {itemId} = await req.json()

        const cartItemToBeDeleted = prisma.cartItem.delete({
            where: {
                id: itemId
            }
        })

        return NextResponse.json({message: `The cart item from ${(await cartItemToBeDeleted).cartId} has been succesfully removed`}, {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Couldn't remove the cart item" },
            {status: 500}
        )
    }
}