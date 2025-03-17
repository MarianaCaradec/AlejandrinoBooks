"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "../actions/logout";
import { fetchAuth } from "@/utils/fetchs";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const pathName = usePathname();

  useEffect(() => {
    const getAuth = async () => {
      try {
        const data = await fetchAuth();
        if (data) setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error al confirmar autenticación del usuario", error);
      }
    };

    getAuth();
  }, [pathName]);

  return (
    <nav className="bg-black shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md">
      <div>
        <Link
          href="/"
          className="text-[#E4DFDA] hover:text-[#53917E] font-semibold"
        >
          Landing page
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/books" className="text-[#E4DFDA] hover:text-[#53917E]">
          Books
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              href="/profile"
              className="text-[#E4DFDA] hover:text-[#53917E]"
            >
              Profile
            </Link>
            <button
              type="submit"
              onClick={logout}
              className="text-[#E4DFDA] hover:text-[#53917E] font-semibold"
            >
              Log out
            </button>
          </>
        ) : (
          <Link href="/signin" className="text-[#E4DFDA] hover:text-[#53917E]">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
