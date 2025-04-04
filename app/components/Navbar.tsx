"use client";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import CartIcon from "./CartIcon";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { checkAuth, isAuthenticated, setIsAuthenticated, logoutHandler } =
    useAuth();
  const pathName = usePathname();

  useEffect(() => {
    checkAuth();
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
              onClick={logoutHandler}
              className="text-[#E4DFDA] hover:text-[#53917E]"
            >
              Log out
            </button>
            <Link href="/cart" className="text-[#E4DFDA] hover:text-[#53917E]">
              <CartIcon />
            </Link>
          </>
        ) : (
          <Link href="/signin" className="text-[#E4DFDA] hover:text-[#53917E]">
            <button onClick={() => setIsAuthenticated(false)}>Sign in</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
