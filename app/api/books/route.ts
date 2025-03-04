import { NextResponse } from "next/server"
import {BookWithCategory, prisma} from '@/lib/prisma'

export async function GET() {
try {
    const booksFromDb = await prisma.book.findMany({
        include: {
            category: true
        }
    })

    return NextResponse.json(booksFromDb, {status: 200})
} catch (error){
    return NextResponse.json(
        {error: "Error al obtener los libros"},
        {status: 500}
    )
}
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newBook = await prisma.book.create({
            data: {
                title: body.title,
                author: body.author,
                resume: body.resume,
                description: body.description,
                price: body.price,
                categoryId: body.categoryId,
                stock: body.stock
            }
        })

    return NextResponse.json(newBook, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {error: "Error al crear un libro nuevo"},
            {status: 500}
        )
    }
}
