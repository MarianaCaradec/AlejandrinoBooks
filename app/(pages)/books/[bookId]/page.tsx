"use client";
import type { BookWithCategory } from "@/app/lib/prisma";
import { fetchBook } from "@/utils/fetchs";
import Image from "next/image";
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
      if (bookId) {
        const data = await fetchBook(bookId);
        setBook(data);
        setLoading(false);
      }
    };

    getBook();
  }, [bookId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-black shadow-md rounded-lg py-20">
      <h1 className="text-3xl font-bold text-[#D4B483] mb-4">Book Details</h1>
      {book ? (
        <div className="text-[#53917E]">
          <h2 className="text-[#53917E] text-xl font-semibold">{book.title}</h2>
          <h3 className="text-[#53917E] text-lg">Author: </h3>
          <p className="text-[#E4DFDA]">{book.author}</p>
          <Image
            src={book.image}
            width={150}
            height={200}
            alt="Book's cover"
            className="rounded-lg"
          />
          <p className="text-sm text-[#53917E]">Resume: </p>
          <p className="text-[#E4DFDA]">{book.resume}</p>
          <h3 className="text-[#53917E]">Category: </h3>
          <p className="text-[#E4DFDA]">{book.category.name}</p>
          <p className="text-[#53917E]">Description: </p>
          <p className="text-[#E4DFDA]">{book.description}</p>
          <p className="text-lg font-bold text-[#53917E]">
            ${book.price.toString()}
          </p>
        </div>
      ) : (
        <p className="text-red-500">No hay libros disponibles</p>
      )}
    </main>
  );
}
