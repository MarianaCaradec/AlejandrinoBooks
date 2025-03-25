"use client";
import { useBooks } from "@/app/contexts/BooksContext";
import { Book } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/index-browser.js";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [newBook, setNewBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    image: "",
    resume: "",
    description: "",
    price: new Decimal(0),
    categoryId: "",
    stock: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const { books, setBooks, paginationHandler, totalPages, currentPage } =
    useBooks();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value } = e.target;

    setNewBook((prevState: Book) => ({
      ...prevState,
      [name]:
        name === "price" ? new Decimal(value) : files?.[0] ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/books", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al agregar el libro:", errorData.error);
        return;
      }

      const data = await res.json();
      setBooks((prevBooks) => [data, ...prevBooks]);
    } catch (error) {
      console.error(error);
    }

    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const handleDelete = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al eliminar el libro:", errorData.error);
        return;
      }

      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20">
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
          <label className="text-black text-xl font-bold">Image</label>
          <input type="file" name="file" accept="image/*" required />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 my-5">
        {books &&
          books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col items-center justify-between w-full bg-black rounded-lg shadow-md p-4"
            >
              <Link
                href={`/books/${book.id}`}
                className="block text-xl font-semibold hover:text-[#53917E]"
              >
                <h2 className="text-[#53917E] text-xl font-semibold">
                  {book.title}
                </h2>
              </Link>
              <h3 className="text-[#53917E] text-lg">Author: </h3>
              <p className="text-[#E4DFDA]">{book.author}</p>
              <Image
                src={book.image}
                width={150}
                height={200}
                alt="Book's cover"
                className="rounded-lg"
              />
              <button
                onClick={() => handleDelete(book.id)}
                className="bg-[#D4B483] text-black text-xl font-bold rounded-md p-3 mt-2 w-full"
              >
                Delete book
              </button>
            </div>
          ))}
      </div>
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
};

export default AdminPage;
