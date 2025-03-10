"use client";
import { fetchBooks } from "@/utils/fetchs";
import { Book } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/index-browser.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newBook, setNewBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    resume: "",
    description: "",
    price: new Decimal(0),
    categoryId: "",
    stock: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewBook((prevState) => ({
      ...prevState,
      [name]: name === "price" ? new Decimal(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("📦 Datos del libro antes de enviar:", newBook);

    if (!newBook) {
      console.error("🚨 Error: newBook es null o undefined");
      return;
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBook,
          price: newBook?.price ? newBook.price.toString() : "0",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al agregar el libro");
      }

      const data = await res.json();
      setBooks([data, ...books]);
      console.log("Libro agregado:", data);
    } catch (error) {
      console.error(error);
    }

    const form = e.target as HTMLFormElement;
    form.reset();
  };

  useEffect(() => {
    const getBooks = async () => {
      try {
        const data = await fetchBooks(currentPage, 5);
        setBooks(data.booksFromDb);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
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
    <div className="max-w-4xl mx-auto p-6 py-20">
      <div>
        <h1 className="text-3xl font-bold text-[#D4B483] mb-6">
          Welcome, admin
        </h1>
        <h2 className="text-2xl font-bold text-[#D4B483] mb-6">
          Here you'll be able to create and delete any book that you like
        </h2>
      </div>
      <div className="flex flex-col items-center gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-[#D4B483] p-10 rounded-md w-full max-w-md"
        >
          <label className="text-black text-xl font-bold">Title</label>
          <input
            type="text"
            name="title"
            placeholder="title"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full "
          />
          <label className="text-black text-xl font-bold">Author</label>
          <input
            type="text"
            name="author"
            placeholder="author"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          <label className="text-black text-xl font-bold">Resume</label>
          <input
            type="text"
            name="resume"
            placeholder="resume"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          <label className="text-black text-xl font-bold">Description</label>
          <input
            type="text"
            name="description"
            placeholder="description"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          <label className="text-black text-xl font-bold">Price</label>
          <input
            type="decimal"
            name="price"
            placeholder="price"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          <label className="text-black text-xl font-bold">Category Id</label>
          <input
            type="text"
            name="categoryId"
            placeholder="categoryId"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          <label className="text-black text-xl font-bold">Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="stock"
            onChange={handleChange}
            required
            className="text-center text-lg text-[#D4B483] rounded-md bg-black w-full"
          />
          <div className="my-4 mx-6">
            <button
              type="submit"
              className="bg-black text-[#D4B483] text-xl font-bold rounded-md p-3 w-full"
            >
              Create book
            </button>
          </div>
        </form>
      </div>
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
                <p className="text-[#53917E] text-sm">
                  {book.price.toString()}
                </p>
                <button>Delete book</button>
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
    </div>
  );
};

export default AdminPage;
