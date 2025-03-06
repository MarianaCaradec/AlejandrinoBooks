import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black shadow-md p-4 flex justify-between items-center">
      <div>
        <Link
          href="/"
          className="text-white-600 hover:text-orange-800 font-semibold"
        >
          Landing page
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/books" className="text-white-700 hover:text-orange-900">
          Books
        </Link>
        <Link
          href="/categories"
          className="text-white-700 hover:text-orange-900"
        >
          Categories
        </Link>
        <Link href="/profile" className="text-white-700 hover:text-orange-900">
          My profile
        </Link>
      </div>
    </nav>
  );
}
