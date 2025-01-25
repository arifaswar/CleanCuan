"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AddOperational = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new operational:", { name, description, amount });

    const newOperational = {
      name,
      description,
      amount,
    };

    console.log("Sending operational data:", newOperational);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/oprationals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOperational),
      }
    );

    if (response.ok) {
      console.log("Operational successfully added");
      Swal.fire({
        icon: "success",
        title: "Operational Added",
        text: "The new operational has been successfully added!",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/outlet/operational");
      });
    } else {
      console.error("Failed to create operational");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add operational. Please try again later.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1E3A8A",
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    setAmount(value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-teal-500 to-teal-400">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add New Operational
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Section */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter operational description"
            />
          </div>

          {/* Amount Section */}
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-lg font-medium text-gray-700"
            >
              Price (IDR)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleAmountChange}
              required
              min="0"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Add Operational
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOperational;
