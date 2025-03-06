import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url)

        const categoryId = searchParams.get("categoryId")

        if (!categoryId) {
            return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
        }

        const booksByCategory = await prisma.book.findMany({
            include: {
                category: true
            },
            where: {
                categoryId: categoryId
            }
        })

        return NextResponse.json(booksByCategory, {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido al encontrar los libros de esta categoria" },
            {status: 500}
        )
    }
}