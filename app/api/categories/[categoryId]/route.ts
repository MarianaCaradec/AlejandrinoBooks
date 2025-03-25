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
            {error: "Couldn't reach the declared category"},
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
            return NextResponse.json(updatedCategory, {status: 200})
        } catch (error) {
            return NextResponse.json({error: "Couldn't update category"})
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
            return NextResponse.json({message: `The category ${categoryToBeDeleted.name} has been succesfully removed`}, {status: 200})
        } catch (error) {
            return NextResponse.json({error: "Couldn't remove the category"})
        }
    }