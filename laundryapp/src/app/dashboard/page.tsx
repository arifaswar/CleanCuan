"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { AppError, operationalType, transactionType } from "@/types";
import errorHandler from "@/helpers/errorHandler";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function Dashboard() {
  const [operationals, setOperationals] = useState<operationalType[]>([]);
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const operationalRes = await fetch("/api/operationals");
        const operationalData = await operationalRes.json();
        setOperationals(operationalData);

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

  const transactionData = {
    labels: transactions.map((transaction) => transaction.transactionDate),
    datasets: [
      {
        label: "Total Amount",
        data: transactions.map((transaction) => transaction.totalAmount),
        backgroundColor: [
          "rgba(0, 123, 255, 0.6)",
          "rgba(40, 167, 69, 0.6)",
          "rgba(255, 193, 7, 0.6)",
          "rgba(220, 53, 69, 0.6)",
          "rgba(23, 162, 184, 0.6)",
        ],
        borderColor: [
          "rgba(0, 123, 255, 1)",
          "rgba(40, 167, 69, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(220, 53, 69, 1)",
          "rgba(23, 162, 184, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(0, 123, 255, 0.8)",
          "rgba(40, 167, 69, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
          "rgba(23, 162, 184, 0.8)",
        ],
        hoverBorderColor: [
          "rgba(0, 123, 255, 1)",
          "rgba(40, 167, 69, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(220, 53, 69, 1)",
          "rgba(23, 162, 184, 1)",
        ],
      },
    ],
  };

  const operationalData = {
    labels: operationals.map((operational) => operational.name),
    datasets: [
      {
        label: "Amount",
        data: operationals.map((operational) => operational.amount),
        backgroundColor: [
          "rgba(0, 123, 255, 0.6)",
          "rgba(40, 167, 69, 0.6)",
          "rgba(255, 193, 7, 0.6)",
          "rgba(220, 53, 69, 0.6)",
          "rgba(23, 162, 184, 0.6)",
        ],
        borderColor: [
          "rgba(0, 123, 255, 1)",
          "rgba(40, 167, 69, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(220, 53, 69, 1)",
          "rgba(23, 162, 184, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(0, 123, 255, 0.8)",
          "rgba(40, 167, 69, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(220, 53, 69, 0.8)",
          "rgba(23, 162, 184, 0.8)",
        ],
        hoverBorderColor: [
          "rgba(0, 123, 255, 1)",
          "rgba(40, 167, 69, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(220, 53, 69, 1)",
          "rgba(23, 162, 184, 1)",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-500 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center mb-8">
          {/* <h1 className="text-4xl font-bold">Dashboard</h1> */}
          <p className="text-4xl font-bold text-emerald-700 mt-2">
            Overview of your business performance
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Reports", link: "/outlet/report" },
            { title: "Transactions", link: "/outlet/transaction" },
            { title: "Operationals", link: "/outlet/operational" },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center hover:bg-opacity-30 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-teal-400 hover:to-emerald-600 transition transform duration-300 ease-out">
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-center mb-4">
              Transaction Overview
            </h2>
            <Doughnut
              data={transactionData}
              options={{
                responsive: true,
              }}
            />
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-lg mb-1">
            <h2 className="text-lg font-bold text-center mb-4">
              Operational Overview
            </h2>
            <Doughnut
              data={operationalData}
              options={{
                responsive: true,
              }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {[
            { title: "Transaction On Process", link: "/outlet/transaction" },
            { title: "Transaction Success", link: "/outlet/transaction" },
          ].map((item, index) => (
            <Link key={index} href={item.link}>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-lg text-center hover:bg-opacity-30 transition">
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
