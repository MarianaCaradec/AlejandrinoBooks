"use client";
import { fetchCategories } from "@/utils/fetchs";
import { useEffect, useState } from "react";
import { CategoryWithBooks } from "@/app/lib/prisma";
import { useBooks } from "@/app/contexts/BooksContext";
import Books from "@/app/components/Books";

export default function page() {
  const [categories, setCategories] = useState<CategoryWithBooks[] | null>(
    null
  );
  const {
    categoryId,
    setCategoryId,
    updateUrlParams,
    inputSearch,
    setInputSearch,
    handleSearch,
  } = useBooks();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleSelect = (categoryId: string) => {
    setCategoryId(categoryId);
    updateUrlParams("categoryId", categoryId || null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <main>
        <h1 className="text-3xl font-bold text-[#D4B483] mb-6">Books</h1>
        <div className="flex items-center justify-center gap-3 py-5">
          <input
            placeholder="search by title, author or category"
            name="text"
            type="text"
            onChange={(e) => setInputSearch(e.target.value)}
            value={inputSearch}
            className="bg-[#D4B483] text-black text-lg rounded-md placeholder-black p-4 w-full max-w-md"
          />
          <button onClick={() => handleSearch(inputSearch)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="25px"
              width="25px"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={1.5}
                stroke="#D4B483"
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
              />
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={1.5}
                stroke="#D4B483"
                d="M22 22L20 20"
              />
            </svg>
          </button>
        </div>
        <select
          onChange={(e) => {
            handleSelect(e.target.value);
          }}
          value={categoryId}
          className="bg-[#53917E] text-[#E4DFDA] p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition"
        >
          <option value={""}>All books</option>
          {categories &&
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
        <Books />
      </main>
    </div>
  );
}
