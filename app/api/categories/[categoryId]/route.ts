import {prisma} from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ categoryId: string }> }
) {
    try {
        const resolvedParams = await context.params
        const { categoryId } = resolvedParams

        if (!categoryId) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

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
    req: NextRequest,
    context: { params: Promise<{ categoryId: string }> }
) {
    try {
        const resolvedParams = await context.params
        const { categoryId } = resolvedParams
    
            if (!categoryId) {
                return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
            }

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
    req: NextRequest,
    context: { params: Promise<{ categoryId: string }> }
) {
    try {
        const resolvedParams = await context.params
        const { categoryId } = resolvedParams

            if (!categoryId) {
                return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
            }

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