import { NextRequest, NextResponse } from "next/server"
import {prisma} from '@/lib/prisma'

export async function GET(req: NextRequest) {
    if(req.method === "GET") {
        try {
            const { searchParams } = new URL(req.url);
            const pageInt = parseInt(searchParams.get("page") || "1", 10);
            const limitInt = parseInt(searchParams.get("limit") || "10", 10);
        
            if (isNaN(pageInt) || isNaN(limitInt) || pageInt < 1 || limitInt < 1) {
                return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
            }

            const booksFromDb = await prisma.book.findMany({
                skip: (pageInt - 1) * limitInt,
                take: limitInt,
            })

            const totalBooks = await prisma.book.count()

            const totalPages = Math.ceil(Number(totalBooks) / limitInt)
        
            return NextResponse.json({
                booksFromDb,
                totalBooks,
                totalPages,
                currentPage: pageInt
            }, {status: 200})
        } catch (error){
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Error desconocido al encontrar los libros" },
                {status: 500}
            )
        }   
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
