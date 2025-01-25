import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-teal-500 p-0 shadow-md">
      <div className="flex justify-between items-center px-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white flex items-center">
          <img src="/CleanCuan.png" alt="Logo" className="h-20 w-auto mr-4" />
          <span>CleanCuan</span>
        </h1>
        {/* Menu */}
        <div className="space-x-4">
          <Link href="/">
            <button className="px-4 py-2 bg-white text-teal-500 rounded-lg shadow hover:bg-gray-100">
              Home
            </button>
          </Link>
          <Link href="/login">
            <button className="px-4 py-2 bg-white text-teal-500 rounded-lg shadow hover:bg-gray-100">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
