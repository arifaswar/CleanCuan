"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AddServices = () => {
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [name] = useState("");
  const [description, setDescription] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [customService, setCustomService] = useState("");
  const [finalServiceName, setFinalServiceName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting new service:", {
      name,
      price,
      duration,
      description,
    });

    const newService = {
      name: finalServiceName,
      price: Number(price),
      duration,
      description,
    };

    console.log("Sending service data:", newService);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/outlets/services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      }
    );

    if (response.ok) {
      console.log("Service successfully added");
      Swal.fire({
        icon: "success",
        title: "Service Added",
        text: "The new service has been successfully added!",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push("/outlet/service");
        router.refresh();
      });
    } else {
      console.error("Failed to create service");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add service. Please try again later.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1E3A8A",
      });
    }
  };

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    setPrice(value);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    setDuration(value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
    if (e.target.value !== "Other") {
      setFinalServiceName(e.target.value);
    }
  };

  const handleCustomServiceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomService(e.target.value);
    setFinalServiceName(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-teal-500 to-teal-400">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add New Service
        </h2>
        <button
          onClick={() => {
            router.back();
            router.refresh();
          }}
          className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Back
        </button>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name Section */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Service Name
            </label>
            <select
              value={selectedService}
              onChange={handleServiceChange}
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a service</option>
              <option value="Washing">Washing</option>
              <option value="Ironing">Ironing</option>
              <option value="Washing Ironing">Washing & Ironing</option>
              <option value="Dry Cleaning">Dry Cleaning</option>
              <option value="Other">Other</option>
            </select>
  
            {selectedService === "Other" && (
              <input
                type="text"
                value={customService}
                onChange={handleCustomServiceChange}
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter custom service name"
              />
            )}
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
              placeholder="Describe the service"
            />
          </div>
  
          {/* Price Section */}
          <div>
            <label
              htmlFor="price"
              className="block text-lg font-medium text-gray-700"
            >
              Price (Rupiah)
            </label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={handlePriceChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter price"
            />
          </div>
  
          {/* Duration Section */}
          <div>
            <label
              htmlFor="duration"
              className="block text-lg font-medium text-gray-700"
            >
              Duration (days)
            </label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={handleDurationChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter duration in days"
            />
          </div>
  
          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default AddServices;