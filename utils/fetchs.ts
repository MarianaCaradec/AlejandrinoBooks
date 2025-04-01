import { BookWithCategory, CategoryWithBooks } from "@/app/lib/prisma";

// const API_URL = typeof window === 'undefined' 
//     ? process.env.API_URL // Server-side fallback
//     : process.env.NEXT_PUBLIC_API_URL; // Client-side variable

export const fetchBooks = async (page = 1, limit = 5, categoryId?: string, search?: string) => {
    try {
        // console.log('API URL:', API_URL)
        // console.log("Server-side API URL:", process.env.API_URL);
        const categoryQuery = categoryId ? `&categoryId=${categoryId}` : "";
        const searchQuery = search ? `&search=${search}` : "";

        const res = await fetch(`/api/books?page=${page}&limit=${limit}${categoryQuery}${searchQuery}`);
        
        const booksPagination = await res.json()
        return booksPagination
        } catch (error) {
        console.error("Error fetching books:", error);
        return { booksFromDb: [], totalBooks: 0, totalPages: 1, currentPage: 1 };
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

export const fetchCategories = async (): Promise<CategoryWithBooks[] | null> => {
    try {
        const res = await fetch(`/api/categories`);
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

export const fetchAuth = async () => {
    try {
        const res = await fetch(`/api/auth/me`, { cache: "no-store" });
        const auth = await res.json();

        if (!res.ok) return { isAuthenticated: false };
        
        return auth
    } catch (error) {
        console.error("Error authenticating user:", error)
    }
}