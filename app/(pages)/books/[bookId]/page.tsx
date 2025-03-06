"use client";
import type { BookWithCategory } from "@/lib/prisma";
import { fetchBook } from "@/utils/fetchs";
import { Book } from "@prisma/client";
import { use, useEffect, useState } from "react";

export default function BookDetails({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const [book, setBook] = useState<BookWithCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { bookId } = use(params);

  useEffect(() => {
    const getBook = async () => {
      const data = await fetchBook(bookId);
      setBook(data);
      setLoading(false);
    };

    getBook();
  }, [bookId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-black shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-orange-900 mb-4">Book Details</h1>
      {book ? (
        <div className="space-y-2 text-gray-500">
          <p className="text-xl font-semibold">{book.title}</p>
          <p className="text-lg">Author: {book.author}</p>
          <p className="text-sm text-gray-500">{book.resume}</p>
          <p className="text-gray-500">Category: {book.category.name}</p>
          <p className="text-gray-500">{book.description}</p>
          <p className="text-lg font-bold text-orange-600">
            ${book.price.toString()}
          </p>
        </div>
      ) : (
        <p className="text-red-500">No hay libros disponibles</p>
      )}
    </main>
  );
}
