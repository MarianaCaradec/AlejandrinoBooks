import { NextRequest, NextResponse } from "next/server"
import {prisma} from '@/lib/prisma'
import { Decimal } from "@prisma/client/runtime/index-browser.js";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url);

            const pageInt = parseInt(searchParams.get("page") || "1", 10);
            const limitInt = parseInt(searchParams.get("limit") || "5", 10);

            const wordToBeSearched = searchParams.get("search")?.trim() || ""
            const categoryId = searchParams.get("categoryId") || ""
        
            if (isNaN(pageInt) || isNaN(limitInt) || pageInt < 1 || limitInt < 1) {
                return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
            }

            const whereConditions: Prisma.bookWhereInput = {}

            if (categoryId) {
                whereConditions.categoryId = categoryId
            }

            if (wordToBeSearched) {
                whereConditions.OR = [
                        {title: {contains: wordToBeSearched}}, 
                        {author: {contains: wordToBeSearched}},
                        {category: {name: {contains: wordToBeSearched}}}
                ]
            }

            const booksFromDb = await prisma.book.findMany({
                include: {
                    category: true
                },
                where: whereConditions,
                skip: (pageInt - 1) * limitInt,
                take: limitInt
            }) ?? []

            const totalBooks = await prisma.book.count({ where: whereConditions })

            const totalPages = Math.ceil(Number(totalBooks) / limitInt)
        
            return NextResponse.json({
                booksFromDb: booksFromDb ?? [],
                totalBooks: totalBooks ?? 0,
                totalPages: totalPages ?? 1,
                currentPage: pageInt
            }, {status: 200})
        } catch (error){
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Error desconocido al encontrar los libros" },
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
                price: new Decimal(body.price),
                categoryId: body.categoryId,
                stock: Number(body.stock)
            }
        })
        console.log("✅ Libro creado:", newBook);
    return NextResponse.json(newBook, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error al crear un libro nuevo"},
            {status: 500}
        )
    }
}
