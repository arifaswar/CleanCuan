"use client";

import { useEffect, useState } from "react";
import { operationalType } from "@/types";
import Link from "next/link";

export default function FeaturedProducts() {
  const [operationals, setOperationals] = useState<operationalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperationals = async () => {
      try {
        const response = await fetch("/api/operationals");
        if (!response.ok) throw new Error("Failed to fetch operationals");
        const data = await response.json();
        setOperationals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOperationals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-16 w-16 text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Operational Management
        </h2>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <Link href={"/outlet/operational/add"}>
              <button className="bg-teal-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Operational
              </button>
            </Link>

            <div className="bg-gray-50 rounded-xl p-6 shadow-md">
              <div className="space-y-3">
                <div className="text-lg">
                  <span className="text-gray-600">Total Operational:</span>
                  <span className="ml-2 font-bold text-teal-600">
                    {operationals.length}
                  </span>
                </div>
                <div className="text-lg">
                  <span className="text-gray-600">Total Expense:</span>
                  <span className="ml-2 font-bold text-teal-600">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(
                      operationals.reduce((total, op) => total + op.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl shadow-md border border-gray-100">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-white uppercase bg-teal-500">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No.
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {operationals.map((operational, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {operational.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {operational.date}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {operational.description}
                    </td>
                    <td className="px-6 py-4 font-semibold text-teal-600">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(operational.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
