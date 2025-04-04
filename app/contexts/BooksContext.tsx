"use client";
import { Book } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchBooks } from "@/utils/fetchs";

interface BooksContextType {
  books: Book[];
  setBooks: Dispatch<SetStateAction<Book[]>>;
  categoryId: string;
  setCategoryId: Dispatch<SetStateAction<string>>;
  inputSearch: string;
  setInputSearch: Dispatch<SetStateAction<string>>;
  totalPages: number;
  setTotalPages: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  updateUrlParams: (key: string, value: string | null) => void;
  paginationHandler: (action: "prev" | "next") => void;
  handleSearch: (input: string) => void;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [inputSearch, setInputSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const pathName = usePathname();

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

  const handleSearch = (input: string) => {
    updateUrlParams("search", input || null);
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        setBooks,
        categoryId,
        setCategoryId,
        inputSearch,
        setInputSearch,
        totalPages,
        setTotalPages,
        currentPage,
        setCurrentPage,
        loading,
        setLoading,
        updateUrlParams,
        paginationHandler,
        handleSearch,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) throw new Error("useBooks must be used inside BooksProvider");
  return context;
}
