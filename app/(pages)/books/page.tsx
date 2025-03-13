"use client";
import { book } from "@prisma/client";
import { fetchBooks, fetchCategories } from "@/utils/fetchs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryWithBooks } from "@/lib/prisma";
import { usePathname, useSearchParams } from "next/navigation";

export default function Books() {
  const [books, setBooks] = useState<book[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryWithBooks[] | null>(
    null
  );
  const [inputSearch, setInputSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const pathName = usePathname();

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

  const updateUrlParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    window.history.pushState(null, "", `${pathName}?${params.toString()}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (inputSearch) queryParams.set("search", inputSearch);
        if (categoryId) queryParams.set("categoryId", categoryId);

        const data = await fetchBooks(
          currentPage,
          5,
          categoryId || undefined,
          inputSearch || undefined
        );

        if (data) {
          setBooks(data.booksFromDb);
          setTotalPages(data.totalPages);
          if (currentPage !== data.currentPage) {
            setCurrentPage(data.currentPage);
          }
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentPage, searchParams]);

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
      updateUrlParams("page", newPage.toString());
      return newPage;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSelect = (categoryId: string) => {
    setCategoryId(categoryId);
    updateUrlParams("categoryId", categoryId || null);
  };

  const handleSearch = (input: string) => {
    setInputSearch(input);
    updateUrlParams("search", input || null);
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
            onChange={(e) => handleSearch(e.target.value)}
            value={inputSearch}
            className="bg-[#D4B483] text-black text-lg rounded-md placeholder-black p-4 w-full max-w-md"
          />
          <button>
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
        {Array.isArray(books) && books.length > 0 && totalPages > 1 && (
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
