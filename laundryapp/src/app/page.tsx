"use client";

import { motion } from "framer-motion";
import {
  FaRocket,
  FaHome,
  FaPhone,
  FaUsers,
  FaTruck,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-teal-500 min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section
        className="relative bg-teal-600 text-white mb-10 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
        ></div>
        <div className="relative max-w-screen-lg mx-auto text-center px-4">
          <motion.h1
            className="text-7xl font-extrabold mb-6 leading-tight"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.5,
            }}
          >
            Welcome to{" "}
            <span className="text-teal-300 hover:text-teal-200 cursor-pointer">
              CleanCuan
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Your one-stop laundry solution with convenient pick-up and delivery
            services.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.a
              href="#contact"
              className="bg-teal-700 hover:bg-teal-800 text-white py-2 px-6 rounded-full text-md transition duration-300 ease-in-out shadow-md transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
            <motion.a
              href="#about"
              className="bg-transparent border border-white hover:bg-red-600 hover:text-white text-white py-2 px-6 rounded-full text-md transition duration-300 ease-in-out shadow-md transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        className="py-20 mb-4  "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="max-w-screen-xl mx-auto text-center px-6">
          <motion.h2
            className="text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            About Us
          </motion.h2>

          <motion.p
            className="text-xl text-white mb-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            CleanCuan is a web-based app that connects laundry outlets with
            their customers in the easiest way possible. We make laundry simple,
            quick, and stress-free for everyone involved.
          </motion.p>
          <motion.div
            className="grid md:grid-cols-3 gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="bg-teal-50 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{
                scale: 1.05,
                rotate: [0, -2, 2, -2, 0],
              }}
              transition={{ duration: 0.2 }}
            >
              <FaRocket className="text-teal-600 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-teal-600">
                Quick Service
              </h3>
              <p className="text-gray-700 text-lg">
                Experience fast and efficient laundry services.
              </p>
            </motion.div>
            <motion.div
              className="bg-teal-50 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{
                scale: 1.05,
                rotate: [0, -2, 2, -2, 0],
              }}
              transition={{ duration: 0.2 }}
            >
              <FaHome className="text-teal-600 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-teal-600">
                Reliable Outlets
              </h3>
              <p className="text-gray-700 text-lg">
                Trusted outlets for all your laundry needs.
              </p>
            </motion.div>

            <motion.div
              className="bg-teal-50 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{
                scale: 1.05,
                rotate: [0, -2, 2, -2, 0],
              }}
              transition={{ duration: 0.2 }}
            >
              <FaPhone className="text-teal-600 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-teal-600">
                Customer Support
              </h3>
              <p className="text-gray-700 text-lg">
                We are here to assist you at any time.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision and Mission Section */}
      <motion.section
        className="py-20 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-2 mt-6 gap-8">
          <motion.div
            className="bg-teal-50 p-10 rounded-lg shadow-2xl hover:shadow-3xl"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <FaUsers className="text-teal-600 text-7xl mx-auto mb-6" />
            <h3 className="text-4xl font-bold text-teal-600 mb-6 text-center">
              Our Vision
            </h3>
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              To become the leading platform that transforms the laundry
              industry with technology and convenience.
            </p>
          </motion.div>
          <motion.div
            className="bg-teal-50 p-10 rounded-lg shadow-2xl hover:shadow-3xl"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <FaTruck className="text-teal-600 text-7xl mx-auto mb-6" />
            <h3 className="text-4xl font-bold text-teal-600 mb-6 text-center">
              Our Mission
            </h3>
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              Our mission is to provide a simple and efficient platform for
              customers and laundry outlets, improving the laundry experience
              with ease and efficiency.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Us Section */}
      <motion.section
        id="contact"
        className="py-18 bg-teal-600 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="max-w-screen-xl mx-auto text-center px-6">
          <motion.h2
            className="text-5xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            Contact Us
          </motion.h2>
          <motion.p
            className="text-xl text-white leading-relaxed mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            Have a question or need assistance? We are here to help! Reach out to
            us through the following channels.
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
}
