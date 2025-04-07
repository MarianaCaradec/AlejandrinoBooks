import { BookWithCategory, CategoryWithBooks } from "@/app/lib/prisma";
import { AuthError, DatabaseError } from "@/errorHandler";

// const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchBooks = async (page = 1, limit = 5, categoryId?: string, search?: string) => {
    try {
        const categoryQuery = categoryId ? `&categoryId=${categoryId}` : "";
        const searchQuery = search ? `&search=${search}` : "";

        const res = await fetch(`/api/books?page=${page}&limit=${limit}${categoryQuery}${searchQuery}`);

        if (!res.ok) throw new DatabaseError();
        
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

        if (!res.ok) throw new DatabaseError();

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

        if (!res.ok) throw new DatabaseError();

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

        if (!res.ok) throw new DatabaseError();

        const categoryFromDb: CategoryWithBooks = await res.json()
        return categoryFromDb
    } catch (error) {
        console.error("Error fetching category:", error)
        return null
    }
}

export const fetchAuth = async () => {
    try {
        const res = await fetch(`/api/auth/me`, { 
            cache: "no-store",       
            credentials: "include",
            headers: {"Content-Type": "application/json",} 
        });

        if (res.status === 401) throw new AuthError()

        if (!res.ok) throw new DatabaseError();

        const auth = await res.json();

        if (!auth.user || !auth.user.id) throw new AuthError("User ID is missing")
        
        return auth
    } catch (error) {
        console.error("Error authenticating user:", error)
        return null
    }
}

export const fetchCart = async () => {
    try {
        const res = await fetch(`/api/cart`, {credentials: "include"})

        if (res.status === 401) throw new AuthError()

        if (!res.ok) throw new DatabaseError();

        const cart = await res.json()
        return cart.cartItems || []
    } catch (error) {
        console.error("Error fetching cart items", error)
        return []
    }
}