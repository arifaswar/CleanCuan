"use client";

import { useEffect, useState } from "react";
import { employeeDetail } from "@/types";
import Swal from "sweetalert2";
import Link from "next/link";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<employeeDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
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
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete employee");

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );

      Swal.fire({
        title: "Deleted!",
        text: "The employee has been deleted.",
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
    <div className="employees-page py-12 px-6 bg-gray-100">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Employees
      </h2>
      <div className="flex justify-start mb-8">
        <Link href="/outlet/employees/add">
          <button className="bg-teal-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
            + Add Employee
          </button>
        </Link>
      </div>
      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {employees.map((employee) => (
          <div
            key={employee._id}
            className="employee-card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full h-48 bg-gray-200">
              <img
                src={`https://image.pollinations.ai/prompt/the clothing of laundry uniform with the name of ${employee.name} with%20wooden%20background%22?width=500&height=500&nologo=true`}
                alt={employee.name || "Employee Picture"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {employee.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Salary:</strong> Rp.{employee.sallary.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Address:</strong> {employee.address}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <strong>Phone:</strong> {employee.phoneNumber}
              </p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/outlet/employees/edit/${employee._id}`}
                  className="text-blue-500 hover:text-blue-700 font-medium transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
