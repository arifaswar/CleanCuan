import { cookies } from "next/headers";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function TheBar({ children }: { children: React.ReactNode }) {
  const access_token = cookies().get("authorization")?.value; // Ambil token

  return (
    <div className="min-h-screen flex">
      {access_token ? (
        // Tampilkan Sidebar jika token ada
        <div className="flex w-full min-h-screen">
          <Sidebar />
          <div className="flex-grow flex-1 bg-gray-100 p-0">{children}</div>
        </div>
      ) : (
        // Tampilkan Navbar jika token tidak ada
        <div className="w-full">
          <Navbar />
          <div className="p-0">{children}</div>
        </div>
      )}
    </div>
  );
}
