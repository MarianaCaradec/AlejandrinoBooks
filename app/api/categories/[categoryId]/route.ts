import {prisma} from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    req: NextResponse,
    {params,}: {params: {categoryId: string}}) {
    try {
        const {categoryId} = await params
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                books: true
            }
        })
    
        return NextResponse.json(category, {status: 200})
    } catch (error) {
        return NextResponse.json(
            {error: "Error al encontrar la categoria designada"},
            {status: 500}
        )
    }
}

export async function PUT(
    req: NextResponse,
    {params}: {params: {categoryId: string}}) {
        try {
            const {categoryId} = await params
            const body = await req.json()
            const updatedCategory = await prisma.category.update({
                where: {
                    id: categoryId
                },
                data: {
                    name: body.name
                }
            })
        } catch (error) {
            return NextResponse.json({error: "Error al actualizar la categoria elegida"})
        }
    }

export async function DELETE(
    req: NextResponse,
    {params}: {params: {categoryId: string}}) {
        try {
            const {categoryId} = await params
            const categoryToBeDeleted = await prisma.category.delete({
                where: {
                    id: categoryId
                }
            })
            return NextResponse.json({message: `El libro ${categoryToBeDeleted.name} eliminado correctamente`}, {status: 200})
        } catch (error) {
            return NextResponse.json({error: "Error al eliminar el libro solicitado"})
        }
    }