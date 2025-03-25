import {prisma} from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const categoriesFromDb = await prisma.category.findMany({
            include: {
                books: true
            }
        })

        return NextResponse.json(categoriesFromDb, {status: 200})
    } catch (error) {
        return NextResponse.json(
            {error: "Couldn't reach books' categories"},
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
            {error: "Couldn't create category"},
            {status: 500}
        )
    }
}