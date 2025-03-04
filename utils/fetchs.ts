import { BookWithCategory, CategoryWithBooks } from "@/lib/prisma";
import { Book, Category, } from "@prisma/client";

export const fetchBooks = async () => {
    try {
        const res = await fetch("/api/books");
        const booksFromDb = await res.json();
        return booksFromDb
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
