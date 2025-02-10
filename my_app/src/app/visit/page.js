"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { useRouter } from "next/navigation";

const Visit = () => {
  const router = useRouter();
  const { apartments, user, setUser, Vtoken, insertVisitor } = useGlobalContext();
  const [apartmentId, setApartmentId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [visitId, setVisitId] = useState(null);

  // Redirect if user is null or admin
  useEffect(() => {
    if (!user) {
      console.log("User is null");
      router.push("/");
    } else if (user.role === "admin") {
      router.push("/adminvisitor");
    }
  }, [user, router]);

  if (!user) return null; // Prevent rendering while redirecting

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
  };

  const closeModal = () => {
    setVisitId(null);
    router.push("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">Visitor Management System</div>
          <div>
            <h2 className="text-white">Welcome {user.name}</h2>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-4"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-10">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apartmentId">
              Apartment
            </label>
            <select
              id="apartmentId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
            >
              <option value="">Select Apartment</option>
              {apartments.map((apartment) => (
                <option key={apartment.apartmentId} value={apartment.apartmentId}>
                  {apartment.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="visitorName">Visitor Name</label>
            <input
              type="text"
              id="visitorName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entryDate">Entry Date</label>
            <input
              type="date"
              id="entryDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exitDate">Exit Date</label>
            <input
              type="date"
              id="exitDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
            />
          </div>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" type="submit">
            Submit
          </button>
        </form>
      </div>

      {visitId !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Visit ID: {visitId}</h3>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Visit;
