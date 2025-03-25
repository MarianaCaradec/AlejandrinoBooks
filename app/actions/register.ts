"use server"
import bcrypt from "bcryptjs"
import { FormState, SignupFormSchema } from "../lib/userDefinitions"
import { prisma } from "../lib/prisma"

export async function register(state: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, password } = validatedFields.data

    const existingUser = await prisma.user.findUnique({where: {email}})

    if (existingUser) {
        return {message: "User is already registered"}
    }

    const bucketName = process.env.BUCKET_NAME!;

    const defaultImageUrl = `https://storage.googleapis.com/${bucketName}/profile_imgs/default_profile_pic.jpeg`;

    const uploadedFileUrl = formData.get("uploadedFileUrl") as string;
    let fileUrl: string = uploadedFileUrl || defaultImageUrl;

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            image: fileUrl,
            email,
            password: hashedPassword
        }
    })

    return {message: "You've just registered, congratulations!"}
}