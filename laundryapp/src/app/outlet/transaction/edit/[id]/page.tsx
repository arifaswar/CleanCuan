"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { transactionType } from "@/types";

const EditTransaction = () => {
  const router = useRouter();
  const { id } = useParams();
  const [services, setServices] = useState<
    {
      _id: string;
      name: string | undefined;
      price: number | undefined;
      qty: number;
    }[]
  >([]);

  const [transactions, setTransactions] = useState({
    _id: "",
    customerName: "",
    customerAddress: "",
    transactionDate: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log("Fetching service for id:", id);
      fetch(`/api/outlets/transactions/${id}`)
        .then((res) => res.json())

        .then((data: transactionType[]) => {
          if (data) {
            console.log("Transaction data:", data);
            const { _id, customerDetail, transactionDate, status } = data[0];
            if (customerDetail) {
              setTransactions({
                _id: _id?.toString() || "",
                customerName: customerDetail[0].name,
                customerAddress: customerDetail[0].address,
                transactionDate,
                status,
              });
            }
            if (data[0].serviceDetail && data[0].services) {
              const newServices = data[0].serviceDetail.map((service, idx) => {
                return {
                  _id: service._id?.toString() || "",
                  name: service.name,
                  price: service.price,
                  qty: data[0].services ? data[0].services[idx].quantity : 0,
                };
              });

              console.log("Services data:", newServices);
              setServices(newServices);
            }
          }
        })
        .catch((err) => {
          setError("Error fetching transaction data.");
          console.error("Error fetching transaction:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { customerName, customerAddress, transactionDate, status } =
      transactions;

    if (!customerName || !customerAddress || !transactionDate || !status) {
      setError("All fields are required!");
      return;
    }

    const updatedTransaction = {
      customerName,
      customerAddress,
      transactionDate,
      status,
      services: services.map((service) => ({
        serviceId: service._id,
        qty: service.qty,
      })),
    };

    console.log("Updated service data before sending:", updatedTransaction);
    console.log("Services data before sending:", services);
    // return;
    try {
      const response = await fetch(`/api/outlets/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      });

      const responseData = await response.json();
      console.log("Response data from server:", responseData);
      if (response.ok) {
        console.log("Transaction successfully updated");
        router.push(`/outlet/transaction`);
      } else {
        console.error("Server error:", responseData);
        setError(responseData.message || "Failed to update service.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred while updating the service.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
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
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Edit Transaction
      </h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        onClick={() => {
          router.back();
          router.refresh();
        }}
        className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {" "}
        Back{" "}
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="customerName" className="block text-gray-700">
            Customer Name
          </label>
          <input
            readOnly
            type="text"
            id="customerName"
            name="customerName"
            value={transactions.customerName}
            onChange={(e) =>
              setTransactions({ ...transactions, customerName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="customerAddress" className="block text-gray-700">
            Customer Address
          </label>
          <input
            readOnly
            type="text"
            id="customerAddress"
            name="customerAddress"
            value={transactions.customerAddress}
            onChange={(e) =>
              setTransactions({
                ...transactions,
                customerAddress: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="transactionDate" className="block text-gray-700">
            Transaction Date
          </label>
          <input
            readOnly
            type="date"
            id="transactionDate"
            name="transactionDate"
            value={transactions.transactionDate}
            onChange={(e) =>
              setTransactions({
                ...transactions,
                transactionDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700">
            Status
          </label>
          <select
            disabled
            onChange={(e) =>
              setTransactions({ ...transactions, status: e.target.value })
            }
            name="status"
            value={transactions.status}
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
          >
            <option value="pending">Pending</option>
            <option value="pickup">Pick Up</option>
            <option value="dispatch">Dispatch</option>
            <option value="washing">Washing</option>
            <option value="drying">Drying</option>
            <option value="ironing">Ironing</option>
            <option value="deliver">Deliver</option>
            <option value="done">Done</option>
          </select>
          {services.map((service) => (
            <div key={service._id} className="flex gap-4">
              <div>
                <label htmlFor="status" className="block text-gray-700">
                  Service Name
                </label>
                <input
                  readOnly
                  type="text"
                  id="status"
                  value={service.name}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-gray-700">
                  Price (Rupiah)
                </label>
                <input
                  readOnly
                  type="text"
                  id="price"
                  value={service.price}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  required
                />
              </div>
              <div>
                <label htmlFor="qty" className="block text-gray-700">
                  Quantity (kg)
                </label>
                <input
                  type="text"
                  id="qty"
                  value={service.qty}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value || "0", 10);
                    // console.log(e.target.value);
                    setServices(
                      services.map((s) =>
                        s._id === service._id ? { ...s, qty } : s
                      )
                    );
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default EditTransaction;
