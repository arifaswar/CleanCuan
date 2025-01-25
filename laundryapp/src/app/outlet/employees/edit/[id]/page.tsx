"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const EditEmployees = () => {
  const router = useRouter();
  const { id } = useParams();

  const [employee, setEmployee] = useState({
    _id: "",
    name: "",
    sallary: 0,
    address: "",
    phoneNumber: "",
    outletId: "",
    outletDetail: {
      _id: "",
      name: "",
      picName: "",
      phone: "",
      email: "",
      password: "",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log("Fetching employee data for id:", id);
      fetch(`/api/employees/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setEmployee(data);
            console.log("Employee data:", data);
          }
        })
        .catch((err) => {
          setError("Error fetching employee data.");
          console.error("Error fetching employee:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "salary") {
      const numericValue = value ? parseFloat(value) : 0;
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: numericValue,
      }));
    } else if (name === "phoneNumber") {
      const phoneNumber = value.replace(/[^0-9]/g, "");
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: phoneNumber,
      }));
    } else {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, outletId, sallary, phoneNumber, address } = employee;

    if (!name || !address || !sallary || !outletId || !phoneNumber) {
      setError("All fields are required!");
      return;
    }

    const updatedEmployee = {
      name,
      outletId,
      sallary,
      phoneNumber,
      address,
    };

    console.log("Updated employee data before sending:", updatedEmployee);

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push("/outlet/employees");
      } else {
        console.error("Server error:", responseData);
        setError(responseData.message || "Failed to update employee.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred while updating the employee.");
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

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-teal-500 to-teal-400">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Edit Employee
        </h1>
        <button
          onClick={() => {
            router.back();
            router.refresh();
          }}
          className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Back
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}

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
              name="name"
              value={employee.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Salary Section */}
          <div>
            <label
              htmlFor="salary"
              className="block text-lg font-medium text-gray-700"
            >
              Salary (IDR)
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={employee.sallary}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Address Section */}
          <div>
            <label
              htmlFor="address"
              className="block text-lg font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={employee.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Phone Number Section */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={employee.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployees;
