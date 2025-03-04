"use client";
import Link from "next/link";
import type { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/utils/fetchs";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };

    getCategories();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-black shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-orange-900 mb-4">
        Available categories
      </h1>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="p-2 bg-black rounded-lg text-gray-100">
            <Link href={`/categories/${cat.id}`}>
              <p>{cat.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
