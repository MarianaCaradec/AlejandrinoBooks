"use client";
import { Book } from "@prisma/client";
import { fetchBooks } from "@/utils/fetchs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBooks = async () => {
      const data = await fetchBooks();
      setBooks(data);
      setLoading(false);
    };

    getBooks();
  }, []);

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
      </main>
    </div>
  );
}
