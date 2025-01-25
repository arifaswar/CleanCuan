"use client";

import { useState, useEffect } from "react";

type ServiceDetail = {
  serviceId: string;
  price: number;
  name: string;
};

type Transaction = {
  _id: string;
  outletId: string;
  customerId: string;
  transactionDate: string;
  totalAmount: number;
  status: string;
  serviceDetail: ServiceDetail[];
};

type ReportData = {
  transaction: Transaction[];
  totalTransaction: number;
  totalExpense: number;
  totalPrice: number;
};

export default function DailyReport() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(reportData);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/outlets/reports/daily");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized access. Please log in.");
          } else if (response.status === 404) {
            throw new Error("Report data not found.");
          } else {
            throw new Error("Failed to fetch transactions.");
          }
        }

        const data = await response.json();

        const totalPrice = data.transaction.reduce(
          (sum: number, trans: Transaction) => {
            const serviceTotal = trans.serviceDetail.reduce(
              (serviceSum: number, service) => {
                return serviceSum + service.price;
              },
              0
            );
            return sum + serviceTotal;
          },
          0
        );

        setReportData({
          transaction: data.transaction || [],
          totalTransaction: data.totalTransaction || 0,
          totalExpense: data.totalExpense || 0,
          totalPrice,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
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
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!reportData)
    return <p className="text-center text-gray-500">No data available</p>;

  const totalAmount = reportData.transaction.reduce(
    (sum, trans) => sum + trans.totalAmount,
    0
  );

  const income = totalAmount - reportData.totalExpense;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
        Daily Report
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Summary</h2>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Total Transactions:</span>
          <span className="text-gray-800">{reportData.totalTransaction}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Income:</span>
          <span className="text-gray-800">
            Rp. {totalAmount.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Outcome:</span>
          <span className="text-gray-800">
            Rp. {reportData.totalExpense.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-2">
          <span className="font-medium text-gray-600">Profit:</span>
          <span className="text-gray-800">
            Rp. {income.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Transactions
        </h2>
        {reportData.transaction.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Services</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Total Amount</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.transaction.map((trans, index) => (
                <tr
                  key={trans._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } text-gray-800`}
                >
                  <td className="border px-4 py-2">{trans.customerId}</td>
                  <td className="border px-4 py-2">
                    {trans.serviceDetail.map((service, idx) => {
                      return <span key={idx}>{service.name}</span>;
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(trans.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    Rp. {trans.totalAmount.toLocaleString("id-ID")}
                  </td>
                  <td className="border px-4 py-2">{trans.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No transactions available</p>
        )}
      </div>
    </div>
  );
}
