"use client";
import { Book } from "@prisma/client";
import {
  fetchBooks,
  fetchBooksByCategory,
  fetchCategories,
} from "@/utils/fetchs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryWithBooks } from "@/lib/prisma";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryWithBooks[] | null>(
    null
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (categoryId == undefined) return;

    const getData = async () => {
      try {
        let data;

        if (categoryId) {
          data = await fetchBooksByCategory(categoryId);
        } else {
          data = await fetchBooks(currentPage, 5);
        }

        if (data) {
          setBooks(data.booksFromDb || data);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentPage, categoryId]);

  const paginationHandler = (action: "prev" | "next") => {
    setCurrentPage((page) => {
      let newPage = page;

      switch (true) {
        case action === "prev" && page > 1:
          newPage = page - 1;
          break;
        case action === "next" && page < totalPages:
          newPage = page + 1;
          break;
        default:
          break;
      }

      return newPage;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <main>
        <h1 className="text-3xl font-bold text-[#D4B483] mb-6">Books</h1>
        <select
          onChange={(e) => {
            setCategoryId(e.target.value);
          }}
          value={categoryId}
          className="bg-[#53917E] text-[#E4DFDA] p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition"
        >
          <option value={""}>Todos</option>
          {categories &&
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        <ul className="space-y-4 py-4">
          {books && books.length > 0 ? (
            books.map((book) => (
              <li
                key={book.id}
                className="bg-black p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <Link
                  href={`/books/${book.id}`}
                  className="block text-xl font-semibold hover:text-[#53917E]"
                >
                  {book.title}
                </Link>
                <p className="text-[#53917E]">Author: </p>
                <p>{book.author}</p>
                <p className="text-[#53917E] text-sm">
                  {book.price.toString()}
                </p>
              </li>
            ))
          ) : (
            <p>No hay libros disponibles</p>
          )}
        </ul>
        {books.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => paginationHandler("prev")}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#D4B483] text-black rounded disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-[#53917E]">{currentPage}</p>
            <button
              onClick={() => paginationHandler("next")}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#D4B483] text-black rounded disabled:opacity-50"
            >
              Next
            </button>
            <p className="text-[#53917E]">{totalPages}</p>
          </div>
        )}
      </main>
    </div>
  );
}
