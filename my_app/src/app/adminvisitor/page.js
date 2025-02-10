'use client';
import React, { useEffect, useState } from "react";
import Nav from "../components/nav";
import { useGlobalContext } from "../context";
import { useRouter } from "next/navigation";
import { FiSearch, FiCalendar, FiHome, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

const Adminvisitor = () => {
  const router = useRouter();
  const { allVisitors, apartments, user } = useGlobalContext();
  
  const [filter, setFilter] = useState({
    apartmentName: "",
    entryDate: "",
    exitDate: "",
    uniqueCode: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredVisits = allVisitors.filter((visit) => {
    const apartmentName = visit.apartmentId?.name?.toLowerCase() || "";
    const entryDate = visit.entryDate ? visit.entryDate.split("T")[0] : "";
    const exitDate = visit.exitDate ? visit.exitDate.split("T")[0] : "";
    const uniqueCode = visit.uniqueCode ? visit.uniqueCode.toString() : "";
  
    return (
      (filter.apartmentName === "" ||
        apartmentName.includes(filter.apartmentName.toLowerCase())) &&
      (filter.entryDate === "" || entryDate === filter.entryDate) &&
      (filter.exitDate === "" || exitDate === filter.exitDate) &&
      (filter.uniqueCode === "" || uniqueCode.includes(filter.uniqueCode))
    );
  });

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const totalEnteredToday = allVisitors.filter((visit) =>
    visit.entryDate.startsWith(today)
  ).length;
  const totalExitedToday = allVisitors.filter((visit) =>
    visit.exitDate.startsWith(today)
  ).length;
  




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">VMS Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <Nav />
        
        <div className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600">Visitors Entered Today</p>
                  <h3 className="text-2xl font-bold text-gray-900">{totalEnteredToday}</h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600">Visitors Exited Today</p>
                  <h3 className="text-2xl font-bold text-gray-900">{totalExitedToday}</h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="uniqueCode"
                  placeholder="Search by Code"
                  className="pl-10 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter.uniqueCode}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHome className="text-gray-400" />
                </div>
                <select
                  name="apartmentName"
                  className="pl-10 w-full text-gray-400 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter.apartmentName}
                  onChange={handleFilterChange}
                >
                  <option value="">All Apartments</option>
                  {apartments.map((apartment) => (
                    <option key={apartment.name} value={apartment.name}>
                      {apartment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="entryDate"
                  className="pl-10 w-full text-gray-400  rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter.entryDate}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="exitDate" 
                  className="pl-10 w-full text-gray-400 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filter.exitDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Visitors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisits.map((visit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
              >
                <div className="flex flex-col space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {visit.apartmentId?.name || "No Apartment"}
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Visitor" value={visit.visitorName} />
                    <InfoRow label="Phone" value={visit.phoneNumber} />
                    <InfoRow
                      label="Entry Date"
                      value={convertDate(visit.entryDate)}
                    />
                    <InfoRow
                      label="Exit Date"
                      value={convertDate(visit.exitDate)}
                    />
                    <InfoRow
                      label="Code"
                      value={visit.uniqueCode}
                      className="font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, className = "" }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>
    <span className={`text-gray-900 ${className}`}>{value}</span>
  </div>
);

export default Adminvisitor;
