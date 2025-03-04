"use client";
import { Book } from "@prisma/client";
import { fetchBooks } from "@/utils/fetchs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const getBooks = async () => {
      const data = await fetchBooks(currentPage, 10);
      if (data) {
        setBooks(data.booksFromDb);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      }
    };

    getBooks();
  }, [currentPage]);

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
    <div className="max-w-4xl mx-auto p-6">
      <main>
        <h1 className="text-3xl font-bold text-white-900 mb-6">Books</h1>
        <ul className="space-y-4">
          {books &&
            books.map((book) => (
              <li
                key={book.id}
                className="bg-black p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <Link
                  href={`/books/${book.id}`}
                  className="block text-xl font-semibold text-white-600 hover:text-orange-800"
                >
                  {book.title}
                </Link>
                <p className="text-gray-500">Author: {book.author}</p>
                <p className="text-gray-500 text-sm">{book.price.toString()}</p>
              </li>
            ))}
        </ul>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => paginationHandler("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <p>{currentPage}</p>
          <button
            onClick={() => paginationHandler("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
          <p>{totalPages}</p>
        </div>
      </main>
    </div>
  );
}
