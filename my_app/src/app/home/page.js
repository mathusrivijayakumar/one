'use client';
import React, { use, useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { useRouter } from "next/navigation";
import { FiLogOut, FiPlus, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const Home = () => {
  const router = useRouter();
  const { user, visitors, setUser, apartments, insertVisitor } = useGlobalContext();
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showVisitForm, setShowVisitForm] = useState(false);
  
  console.log(apartments)
  // Form states
  const [apartmentId, setApartmentId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [visitId, setVisitId] = useState(null);

  const handleCardClick = (visit) => setSelectedVisit(visit);
  const closeModal = () => {
    setSelectedVisit(null);
    setShowVisitForm(false);
    setVisitId(null);
  };

  const resetForm = () => {
    setApartmentId("");
    setVisitorName("");
    setPhoneNumber("");
    setEntryDate("");
    setExitDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = await insertVisitor(
      apartmentId,
      visitorName,
      phoneNumber,
      entryDate,
      exitDate
    );
    setVisitId(id);
    resetForm();
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Visit Form Modal Component



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">VMS</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Visitor Records</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVisitForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Visit</span>
          </motion.button>
        </div>

        {/* Visitors Grid */}
        {/* ... (rest of the visitors grid code remains the same) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitors.map((visit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleCardClick(visit)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer border border-gray-100"
            >
              <div className="flex flex-col space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {visit.apartmentId.name}
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Visitor" value={visit.visitorName} />
                  <InfoRow label="Phone" value={visit.phoneNumber} />
                  <InfoRow
                    label="Entry Date"
                    value={convertDate(visit.entryDate)}
                  />
                  <InfoRow label="Exit Date" value={convertDate(visit.exitDate)} />
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

      {/* Modals */}
      {showVisitForm &&  (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => closeModal()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">New Visit</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Apartment
                </label>
                <select
                  className="w-full   p-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={apartmentId} 
                  onChange={(e) => setApartmentId(e.target.value)}
                >
                  <option value="">Select Apartment</option>
                  {apartments.map((apartment) => (
                   <option key={apartment.name} value={apartment.apartmentId}>
                      {apartment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Visitor Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Entry Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Exit Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500"
                  value={exitDate}
                  onChange={(e) => setExitDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}
      {visitId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Visit ID: {visitId}
            </h3>
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
      
      {/* Visit Details Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Visit Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <InfoRow
                label="Apartment"
                value={selectedVisit.apartmentId.name}
              />
              <InfoRow label="Visitor" value={selectedVisit.visitorName} />
              <InfoRow label="Phone" value={selectedVisit.phoneNumber} />
              <InfoRow
                label="Entry Date"
                value={convertDate(selectedVisit.entryDate)}
              />
              <InfoRow
                label="Exit Date"
                value={convertDate(selectedVisit.exitDate)}
              />
              <InfoRow
                label="Unique Code"
                value={selectedVisit.uniqueCode}
                className="font-mono"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, className = "" }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>
    <span className={`text-gray-900 ${className}`}>{value}</span>
  </div>
);

export default Home;
