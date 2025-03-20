import { NextRequest, NextResponse } from "next/server"
import {prisma} from '@/app/lib/prisma'
import { Decimal } from "@prisma/client/runtime/index-browser.js";
import { Prisma } from "@prisma/client";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

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
        const bucketName = process.env.BUCKET_NAME!
        const storage = new Storage();
        const bucket = storage.bucket(bucketName)

        const formData = await req.formData()

        const title = formData.get("title") as string
        const author = formData.get("author") as string
        const file = formData.get("file") as File
        const resume = formData.get("resume") as string
        const description = formData.get("description") as string
        const price = formData.get("price") as string
        const categoryId = formData.get("categoryId") as string
        const stock = formData.get("stock") as string

        if(!title || !author || !file || !resume || !description || !price || !categoryId || !stock) {
            return NextResponse.json("Error: obligatory field not filled", {status: 400})
        }

        const fileName = `books_imgs/${uuidv4()}-${file.name}`
        const fileToBeUploaded = bucket.file(fileName)

        const buffer = Buffer.from(await file.arrayBuffer())
        await fileToBeUploaded.save(buffer, {
            metadata: {contentType: file.type},
            public: true
        })

        const fileUrl = `https://storage.cloud.google.com/${bucketName}/${fileName}`

        const newBook = await prisma.book.create({
            data: {
                title,
                author,
                image: fileUrl,
                resume,
                description,
                price: new Decimal(price),
                categoryId,
                stock: Number(stock)
            }
        })

    return NextResponse.json(newBook, {status: 201})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error al crear un libro nuevo"},
            {status: 500}
        )
    }
}