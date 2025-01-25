"use client";

import { useEffect, useState } from "react";
import { serviceType } from "@/types";
import Link from "next/link";
import Swal from "sweetalert2";

const ServicesPage = () => {
  const [services, setServices] = useState<serviceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/outlets/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (slug: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const response = await fetch(`/api/outlets/services/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");

      setServices((prevServices) =>
        prevServices.filter((service) => service.slug !== slug)
      );

      Swal.fire({
        title: "Deleted!",
        text: "Your service has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "An unknown error occurred",
        "error"
      );
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="services-page py-12 px-6 bg-gray-100">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Services
      </h2>
  
      <div className="flex justify-between items-center mb-8">
        <Link href={"/outlet/service/add"}>
          <button className="bg-teal-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
            + Add Service
          </button>
        </Link>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <div
            key={service.slug}
            className="service-card bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col justify-between"
          >
           <div className="flex items-center px-4">
            <img src={`https://image.pollinations.ai/prompt/${service.name}with%20wooden%20background%22?width=500&height=500&nologo=true`} className="w-32 h-32 rounded-md" alt="" />
           <div className="p-6 flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">Price: Rp.{service.price.toLocaleString()}</p>
              <p className="text-gray-600 text-sm mb-4">
                Duration: {service.duration} hari
              </p>
  
              {service.outletDetails && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 font-semibold">
                    Outlet Details:
                  </p>
                  <p className="text-sm text-gray-600">
                    Name Outlet: {service.outletDetails.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {service.outletDetails.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {service.outletDetails.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Address: {service.outletDetails.address}
                  </p>
                </div>
              )}
            </div>
           </div>
          
  
            <div className="p-6 flex justify-between items-center border-t border-gray-200">
              <Link
                href={`/outlet/service/edit/${service.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </Link>
  
              <button
                onClick={() => handleDelete(service.slug)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default ServicesPage;