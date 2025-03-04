import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const categoryFromDb = await prisma.category.findMany({
            include: {
                books: true
            }
        })

        return NextResponse.json(categoryFromDb, {status: 200})
    } catch (error) {
        return NextResponse.json(
            {error: "Error al obtener las categorías de libros"},
            {status: 500}
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newCategory = await prisma.category.create({
            data: {
                name: body.name
            }
        })

        return NextResponse.json(newCategory, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {error: "Error al crear nueva categoria"},
            {status: 500}
        )
    }
}