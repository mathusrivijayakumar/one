import React from "react";

import { useGlobalContext } from "../context";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();
   const { setUser } = useGlobalContext();

   const handleLogout = async () => {
    try {
      await fetch("/api/logout"); // Call the logout API
      setUser(null);
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  return (
    <>
      <div
        className="bg-gray-800 text-white flex flex-col items-start p-4"
        style={{ width: "15%", minHeight: "95vh" }}
      >
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full text-left"
          onClick={() => router.push("/apartment")}
        >
          Apartment
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full text-left mb-4"
          onClick={() => router.push("/adminvisitor")}
        >
          Visitor
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-left"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </>
  );
};

export default Nav;