"use client";
import { fetchCategory } from "@/utils/fetchs";
import { use, useEffect, useState } from "react";
import { CategoryWithBooks } from "@/lib/prisma";
import Link from "next/link";

export default function CategoryId({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const [category, setCategory] = useState<CategoryWithBooks | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { categoryId } = use(params);
  const decodedCategory = decodeURIComponent(categoryId);

  useEffect(() => {
    const getCategory = async () => {
      const data = await fetchCategory(decodedCategory);
      setCategory(data);
      setLoading(false);
    };

    getCategory();
  }, [decodedCategory]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-black shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center text-orange-900 mb-4">
        Category Details
      </h1>
      {category ? (
        <div key={category.id} className="space-y-2 text-gray-500">
          <p className="text-xl font-semibold">{category.name}</p>
          {category.books ? (
            <ul className="flex flex-col items-center justify-center gap-4">
              {category.books.map((book) => (
                <li key={book.id}>
                  <p>{book.title}</p>
                  <p>{book.author}</p>
                  <p>{book.price.toString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay ningún libro disponible todavía en esta categoría</p>
          )}
        </div>
      ) : (
        <p className="text-red-500">No hay libros disponibles</p>
      )}
    </main>
  );
}
