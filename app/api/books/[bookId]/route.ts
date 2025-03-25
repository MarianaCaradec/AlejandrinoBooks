import { NextResponse } from "next/server";
import {BookWithCategory, prisma} from '@/app/lib/prisma'
import { Decimal } from "@prisma/client/runtime/index-browser.js";

export async function GET(
    req: NextResponse,
    {params}: {params: {bookId: string}}) {
        try {
            const {bookId} = await params

            const book: BookWithCategory | null = await prisma.book.findUnique({
                where: {
                    id: bookId
                },
                include: {
                    category: true
                }
            })      
            
            if (!book) {
                return NextResponse.json({ error: 'Book not found' }, { status: 404 });
            }

            return NextResponse.json(book, {status: 200})
        } catch (error) {
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Declared book not found" },
                {status: 500}
            )
        }
}

export async function PUT(
    req: NextResponse,
    {params}: {params: {bookId: string}}) {
        try {
            const {bookId} = await params
            const body = await req.json()

            const updatedBook = await prisma.book.update({
                where: {
                    id: bookId
                },
                data: {
                    title: body.title,
                    author: body.author,
                    resume: body.resume,
                    description: body.description,
                    price: new Decimal(body.price),
                    categoryId: body.categoryId,
                    stock: Number(body.stock)
                }
            })

            return NextResponse.json(updatedBook, {status: 200})
        } catch (error) {
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Couldn't update the book" },
                {status: 500}
            )
        }
}

export async function DELETE(
    req: NextResponse,
    {params}: {params: {bookId: string}}) {
        try {
            const {bookId} = await params

            const bookToBeDeleted = await prisma.book.delete({
                where: {
                    id: bookId
                }
            })
            return NextResponse.json({message: `The book ${bookToBeDeleted.title} has been succesfully removed`}, {status: 200})
        } catch (error) {            
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Couldn't remove the book" },
                {status: 500}
            )
        }
}