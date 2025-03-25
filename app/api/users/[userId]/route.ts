import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: NextResponse,
    {params}: {params: {userId: string}}) {
        try {
            const {userId} = await params

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })      
            
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            return NextResponse.json(user, {status: 200})
        } catch (error) {
            return NextResponse.json(
                {error: "Couldn't reach the user"},
                {status: 500}
            )
        }
}

export async function PUT(
    req: NextResponse,
    {params}: {params: {userId: string}}) {
        try {
            const {userId} = await params
            const body = await req.json()

            const updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name: body.name,
                    password: body.password
                }
            })

            return NextResponse.json(updatedUser, {status: 200})
        } catch (error) {
            return NextResponse.json(
                {error: "Couldn't update the user"},
                {status: 500}
            )
        }
}

export async function DELETE(
    req: NextResponse,
    {params}: {params: {userId: string}}) {
        try {
            const {userId} = await params

            const userToBeDeleted = await prisma.user.delete({
                where: {
                    id: userId
                }
            })
            return NextResponse.json({message: `The user ${userToBeDeleted.email} has been successfully removed`}, {status: 200})
        } catch (error) {            
            return NextResponse.json(
                {error: "Couldn't remove the user"},
                {status: 500}
            )
        }
}