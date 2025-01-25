"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const EditService = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [service, setService] = useState({
    name: "",
    slug: "",
    price: 0,
    duration: 0,
    outletId: "",
    outletDetails: {
      name: "",
      picName: "",
      picPhone: "",
      email: "",
      address: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const outletId = Cookies.get("outletId");
    if (outletId) {
      setService((prevService) => ({
        ...prevService,
        outletId: outletId,
      }));
    }

    if (slug) {
      setLoading(true);
      console.log("Fetching service for slug:", slug);
      fetch(`/api/outlets/services/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setService(data);
          }
        })
        .catch((err) => {
          setError("Error fetching service data.");
          console.error("Error fetching service:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "duration" || name === "price") {
      const numericValue = value ? parseFloat(value) : 0;
      setService((prevService) => ({
        ...prevService,
        [name]: numericValue,
      }));
    } else {
      setService((prevService) => ({
        ...prevService,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, outletId, duration, price } = service;

    if (!name || !duration || !price || !outletId) {
      setError("All fields are required!");
      return;
    }

    if (isNaN(duration) || isNaN(price)) {
      setError("Duration and Price must be valid numbers.");
      return;
    }

    const updatedServiceData = {
      name,
      outletId,
      duration,
      price,
    };

    console.log("Updated service data before sending:", updatedServiceData);

    try {
      const response = await fetch(`/api/outlets/services/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedServiceData),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push(`/outlet/service`);
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
        Edit Service
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
          <label htmlFor="name" className="block text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={service.name}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700">
            Duration (days)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={service.duration}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">
            Price (IDR)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={service.price}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded"
        >
          Update Service
        </button>
      </form>
    </div>
  );
};

export default EditService;