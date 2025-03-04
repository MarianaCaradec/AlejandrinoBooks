import { BookWithCategory, CategoryWithBooks } from "@/lib/prisma";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const fetchBooks = async (page = 1, limit = 10) => {
    try {
        const res = await fetch(`${API_URL}/api/books?page=${page}&limit=${limit}`);
        const booksPagination = await res.json();
        return booksPagination
        } catch (error) {
        console.error("Error fetching books:", error);
    };
}

export const fetchBook = async (bookId: string): Promise<BookWithCategory | null> => {
    try {
        const res = await fetch(`/api/books/${bookId}`);
        const bookFromDb: BookWithCategory = await res.json();
        return bookFromDb
    } catch (error) {
        console.error("Error fetching book:", error);
        return null
    }
};

export const fetchCategories = async () => {
    try {
        const res = await fetch("/api/categories");
        const categoriesFromDb = await res.json();
        return categoriesFromDb
    } catch (error) {
        console.error("Error fetching categories:", error);
    } 
}

export const fetchCategory = async (categoryId: string): Promise<CategoryWithBooks | null> => {
    try {
        const res = await fetch(`/api/categories/${categoryId}`)
        const categoryFromDb: CategoryWithBooks = await res.json()
        return categoryFromDb
    } catch (error) {
        console.error("Error fetching category:", error)
        return null
    }
}
