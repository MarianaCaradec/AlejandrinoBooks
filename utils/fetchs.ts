import { BookWithCategory, CategoryWithBooks } from "@/lib/prisma";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchBooks = async (page = 1, limit = 5) => {
    try {
        const res = await fetch(`${API_URL}/api/books?page=${page}&limit=${limit}`);
        const booksPagination = await res.json()
        return booksPagination
        } catch (error) {
        console.error("Error fetching books:", error);
        return []
    };
}

export const fetchBooksByCategory = async (categoryId: string): Promise<BookWithCategory[] | null> => {
    try {
        const res = await fetch(`${API_URL}/api/books/byCategory?categoryId=${categoryId}`)
        const booksByCategory: BookWithCategory[] = await res.json()
        return booksByCategory
    } catch (error) {
        console.error("Error fetching books by category:", error);
        return []
    }
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

export const fetchCategories = async (): Promise<CategoryWithBooks[] | null> => {
    try {
        const res = await fetch("/api/categories");
        const categoriesFromDb: CategoryWithBooks[] = await res.json();
        return categoriesFromDb
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []
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
