"use client";
import ErrorNotification from "@/components/ErrorNotification";
import React, { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { AppError } from "@/types";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "admin" }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        await Swal.fire({
          title: "Login Berhasil!",
          text: "Anda akan diarahkan ke dashboard.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        window.location.href = "/dashboard";
      } else {
        await Swal.fire({
          title: "Login Gagal",
          text: data.message || "Login gagal. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Tidak dapat memproses login. Silakan coba lagi nanti.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(error as AppError);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-teal-500 overflow-hidden">
      <div className="flex flex-1 items-center justify-center py-16 px-8">
        <div className="flex flex-col items-center justify-center space-y-8 md:space-y-0 md:flex-row md:space-x-12 w-full max-w-7xl">
          <div className="flex-shrink-0 md:w-1/2 w-2/3">
            <img
              src="/CleanCuan.png"
              alt="Logo"
              className="w-full h-auto object-contain md:h-[20rem]"
            />
            <h2 className="text-4xl text-white font-bold text-center">
              Get Clean with Cuan
            </h2>
          </div>

          {/* Login Form */}
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm mx-auto md:w-1/3">
            <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">
              LOGIN
            </h2>
            <ErrorNotification />
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <div className="spinner-border animate-spin border-4 border-teal-600 rounded-full w-6 h-6 mr-2" />
                    <span>Please Wait...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Dont have an Account?{" "}
                  <Link
                    href="/register"
                    className="text-teal-600 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
