"use client";
import Link from "next/link";
import Image from "next/image";
import { useBooks } from "../contexts/BooksContext";

export default function Books() {
  const { books, totalPages, currentPage, paginationHandler, loading } =
    useBooks();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
              <Image
                src={book.image}
                width={250}
                height={300}
                alt="Book's cover"
              />
              <p className="text-[#53917E] text-sm">{book.price.toString()}</p>
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
    </div>
  );
}
