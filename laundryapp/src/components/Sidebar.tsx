import Link from "next/link";
import LogoutButton from "./Logout";

export default function Sidebar() {
  return (
    <div className="bg-teal-500 min-h-screen  p-4 shadow-md flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-white flex items-center"
          >
            <img src="/CleanCuan.png" alt="Logo" className="h-20 w-auto mr-4" />
            <span>CleanCuan</span>
          </Link>
        </div>

        <ul className="space-y-4">
          <li>
            <Link href="/dashboard">
              <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
                Dashboard
              </button>
            </Link>
          </li>

          <li>
            <Link href="/outlet/service">
              <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
                Services
              </button>
            </Link>
          </li>

          <li>
            <Link href="/outlet/operational">
              <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
                Operationals
              </button>
            </Link>
          </li>

          <li>
            <Link href="/outlet/transaction">
              <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
                Transactions
              </button>
            </Link>
          </li>

          <li>
            <Link href="/outlet/report">
              <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
                Report
              </button>
            </Link>
          </li>

          <li>
            <Link href="/outlet/employees">
              <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
                Employees
              </button>
            </Link>
          </li>
        </ul>
      </div>

      <div className="space-y-4 mt-8 fixed bottom-4 w-52">
        <Link href="/outlet/profile">
          <button className="w-full text-left px-4 py-2 bg-teal-50 text-teal-600 rounded-lg shadow hover:bg-teal-100">
            Profile
          </button>
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
