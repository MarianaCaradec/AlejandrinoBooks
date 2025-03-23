import { prisma } from "@/app/lib/prisma"
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
        const formData = await req.formData()

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const fileUrl = formData.get("file") as string 
        const password = formData.get("password") as string

        if(!name || !email || !password) {
            return NextResponse.json("Error: obligatory field not filled", {status: 400})
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                image: fileUrl,
                password
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