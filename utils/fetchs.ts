import { BookWithCategory, CategoryWithBooks } from "@/app/lib/prisma";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchBooks = async (page = 1, limit = 5, categoryId?: string, search?: string) => {
    try {
        const categoryQuery = categoryId ? `&categoryId=${categoryId}` : "";
        const searchQuery = search ? `&search=${search}` : "";

        const res = await fetch(`${API_URL}/api/books?page=${page}&limit=${limit}${categoryQuery}${searchQuery}`);
        
        const booksPagination = await res.json()
        return booksPagination
        } catch (error) {
        console.error("Error fetching books:", error);
        return { booksFromDb: [], totalBooks: 0, totalPages: 1, currentPage: 1 };
    };
}

export const fetchBook = async (bookId: string): Promise<BookWithCategory | null> => {
    try {
        const res = await fetch(`${API_URL}/api/books/${bookId}`);
        const bookFromDb: BookWithCategory = await res.json();
        return bookFromDb
    } catch (error) {
        console.error("Error fetching book:", error);
        return null
    }
};

export const fetchCategories = async (): Promise<CategoryWithBooks[] | null> => {
    try {
        const res = await fetch(`${API_URL}/api/categories`);
        const categoriesFromDb: CategoryWithBooks[] = await res.json();
        return categoriesFromDb
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []
    } 
}

export const fetchCategory = async (categoryId: string): Promise<CategoryWithBooks | null> => {
    try {
        const res = await fetch(`${API_URL}/api/categories/${categoryId}`)
        const categoryFromDb: CategoryWithBooks = await res.json()
        return categoryFromDb
    } catch (error) {
        console.error("Error fetching category:", error)
        return null
    }
}

export const fetchAuth = async () => {
    try {
        const res = await fetch(`${API_URL}/api/auth/me`, { 
            cache: "no-store",       
            credentials: "include",
            headers: {"Content-Type": "application/json",} 
        });

        if (res.status === 401) {
            return null;
        }
        if (!res.ok) throw new Error("Failed to fetch user data");

        const auth = await res.json();

        if (!auth.user || !auth.user.id) throw new Error("User ID is missing")
        
        return auth
    } catch (error) {
        console.error("Error authenticating user:", error)
        return null
    }
}

export const fetchCart = async () => {
    try {
        const res = await fetch(`${API_URL}/api/cart`, {credentials: "include"})

        if (res.status === 401) {
            return null;
        }
        if (!res.ok) throw new Error("Failed to fetch cart");

        const cart = await res.json()
        return cart.cartItems || []
    } catch (error) {
        console.error("Error fetching cart items", error)
        return []
    }
}