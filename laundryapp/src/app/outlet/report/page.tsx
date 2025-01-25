"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { AppError, transactionType } from "@/types";
import errorHandler from "@/helpers/errorHandler";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // const [operationals, setOperationals] = useState<operationalType[]>([]);
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const operationalsRes = await fetch("/api/oprationals");
        // const operationalsData = await operationalsRes.json();
        // setOperationals(operationalsData);

        const transactionsRes = await fetch("/api/outlets/transactions");
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      } catch (error) {
        return errorHandler(error as AppError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-16 w-16 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
        </svg>
      </div>
    );
  }

  const transactionData = {
    labels: transactions.map((transaction) => transaction.transactionDate),
    datasets: [
      {
        label: "Total Amount",
        data: transactions.map((transaction) => transaction.totalAmount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Link href="/outlet/report">
            <div className="bg-white border border-gray-300 rounded-md p-6 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
              <span className="block mb-3 text-2xl">📊</span> Report
            </div>
          </Link>
          <Link href="/outlet/transaction">
            <div className="bg-white border border-gray-300 rounded-md p-6 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
              <span className="block mb-3 text-2xl">💳</span> Transaction
            </div>
          </Link>
          <Link href="/outlet/operational">
            <div className="bg-white border border-gray-300 rounded-md p-6 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
              <span className="block mb-3 text-2xl">⚙️</span> Operational
            </div>
          </Link>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <Link href="/outlet/report/daily">
              <div className="bg-white border border-gray-300 rounded-md p-4 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
                Daily Report
              </div>
            </Link>
            <Link href="/outlet/report/weekly">
              <div className="bg-white border border-gray-300 rounded-md p-4 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
                Weekly Report
              </div>
            </Link>
            <Link href="/outlet/report/monthly">
              <div className="bg-white border border-gray-300 rounded-md p-4 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
                Monthly Report
              </div>
            </Link>
            <Link href="/outlet/report/yearly">
              <div className="bg-white border border-gray-300 rounded-md p-4 text-center text-gray-800 font-semibold shadow-lg hover:shadow-xl transition duration-300 cursor-pointer transform hover:scale-105">
                Yearly Report
              </div>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
            <h2 className="text-xl font-semibold text-center mb-4">Transaction Report</h2>
            <div className="w-full h-64">
              <Bar data={transactionData} options={{ responsive: true, plugins: { title: { display: true, text: "Transaction Overview" } } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
