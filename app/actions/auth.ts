"use server"
import { LogInFormSchema, FormState } from '@/app/lib/userDefinitions'
import bcrypt from 'bcryptjs'
import { SignJWT } from "jose";
import { prisma } from '../lib/prisma'
import { cookies } from 'next/headers';
import { UserInputError } from '@/errorHandler';

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = LogInFormSchema.safeParse({
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
        throw new UserInputError('User not found')
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        throw new UserInputError()

    }

    const role = user.role

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({email, role})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime('2h')
    .sign(JWT_SECRET);

    (await cookies()).set("token", token, {httpOnly: true, secure: true, path: "/"})
    return { message: "Login successful!" };
}

