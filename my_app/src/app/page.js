'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiLogIn, FiUserPlus, FiCheck, FiShield, FiClock, FiUsers } from "react-icons/fi";

const Home = () => {
  const router = useRouter();

  const features = [
    { icon: <FiUsers />, title: "Easy Visitor Check-ins", description: "Streamlined process for quick and efficient visitor registration" },
    { icon: <FiShield />, title: "Enhanced Security", description: "Secure visitor tracking and data management" },
    { icon: <FiClock />, title: "Real-time Updates", description: "Instant notifications and live visitor status" },
    { icon: <FiCheck />, title: "Efficient Management", description: "Comprehensive dashboard for visitor data management" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-indigo-600">VMS</span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                onClick={() => router.push("/register")}
              >
                <FiUserPlus className="w-5 h-5" />
                <span>Register</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                onClick={() => router.push("/login")}
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to the Next-Gen
                <span className="text-indigo-600"> Visitor Management</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Transform your visitor experience with our modern, secure, and efficient management system.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
                onClick={() => router.push("/register")}
              >
                Get Started Now
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to manage visitors effectively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-indigo-600 text-3xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of organizations already using our system
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              onClick={() => router.push("/register")}
            >
              Sign Up Now
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
