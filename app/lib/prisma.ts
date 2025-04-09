import { CartItem, Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type BookWithCategory = Prisma.BookGetPayload<{
    include: { category: true };
}>;

export type CategoryWithBooks = Prisma.CategoryGetPayload<{
    include: { books: true }
}>;

export interface CartItemWithBook extends CartItem {
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  bookPrice: number;
}

export interface OrderItemWithBook {
  bookId: string;
  quantity: number;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  bookPrice: number;
}