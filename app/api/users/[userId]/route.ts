import { prisma } from "@/lib/prisma";
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
                return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }

            return NextResponse.json(user, {status: 200})
        } catch (error) {
            return NextResponse.json(
                {error: "Error al encontrar el usuario solicitado"},
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
                {error: "No fue posible actualizar el usuario declarado"},
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
            return NextResponse.json({message: `El usuario ${userToBeDeleted.email} fue eliminado correctamente`}, {status: 200})
        } catch (error) {            
            return NextResponse.json(
                {error: "Error al eliminar el usuario solicitado"},
                {status: 500}
            )
        }
}