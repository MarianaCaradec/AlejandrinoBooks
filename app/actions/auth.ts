"use server"
import { SignupFormSchema, FormState } from '@/app/lib/userDefinitions'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { prisma } from '../lib/prisma'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    console.log("Login function started");
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    const user = await prisma.user.findUnique({where: {email}})

    if (!user) {
        return {message: "Email does not exist"}
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return {message: 'Incorrect password'}
    }

    const role = user.role
    const token = jwt.sign({email, role}, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    console.log("Generated token:", token);

    (await cookies()).set("token", token, {httpOnly: true, secure: true})
    console.log("Token stored in cookies:", (await cookies()).get("token"));

    console.log("Redirecting to /books"); // Debugging log
    return redirect("/books");
}

