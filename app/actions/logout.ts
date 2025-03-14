"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout () {
    (await cookies()).set("token", "", {expires: new Date(0)})
    redirect('/')
}