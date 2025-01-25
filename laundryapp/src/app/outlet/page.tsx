"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Transaction } from "@/types";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/outlets/transactions");
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto p-6 bg-gray-800 rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-100">Transactions</h1>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-start">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600">
            Balance Transaction
          </button>
          <button className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600">
            Total Transaction
          </button>
        </div>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600">
          Sort By:
        </button>
      </div>
      
      {/* Transaction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg hover:shadow-2xl"
          >
            <h2 className="text-lg font-semibold mb-2">Transaction:</h2>
            <p className="text-sm mb-1">id: {transaction.id}</p>
            <p className="text-sm mb-1">Customer Name: {transaction.customerName}</p>
            <p className="text-sm mb-1">Customer Address: {transaction.customerAddress}</p>
            <p className="text-sm mb-1">Date Transaction: {transaction.dateTransaction}</p>
            <p className="text-sm mb-1">Status: {transaction.status}</p>
            <p className="text-sm mb-4">Update Status: {transaction.updateStatus}</p>
            <Link href={`/outlet/transaction/edit/${transaction.id}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
                Edit Status
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
