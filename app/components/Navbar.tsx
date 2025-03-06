import Link from "next/link";

export default function Navbar() {
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
        <Link href="/profile" className="text-[#E4DFDA] hover:text-[#53917E]">
          My profile
        </Link>
      </div>
    </nav>
  );
}
