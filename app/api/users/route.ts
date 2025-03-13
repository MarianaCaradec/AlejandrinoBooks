import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users, {status: 200})
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error desconocido al encontrar los los usuarios" },
            {status: 500}
        )
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            }
        })

        return NextResponse.json(newUser, {status: 201})
    } catch (error) {
        return NextResponse.json(
            {error: "Error al crear un usuario nuevo"},
            {status: 500}
        )
    }
}