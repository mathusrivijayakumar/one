'use client'
import React, { useContext, useState } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { UserLogin, UserRegister } from "./action";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const url = "http://localhost:3000";
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [Vtoken, setVtoken] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [allVisitors,setAllVisitors] = useState([]);

  const registerUser = async (username, email, password) => {
    try {
      const role = "user";
      
     
      const result= await UserRegister(username,email,password,role);

 
      if (result.success) {
        router.push("/login");
      }
    } catch (error) {
      alert("Check the values");
      console.error("Error registering user:", error);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const result =await UserLogin(email,password);
      console.log(result)
 
      if (result.success === true) {
        const {  user } = result;
        const {role } =user
        console.log(user)
        setUser(user);
        
         console.log(user)
         console.log(role)
        if (role === 'admin') {
          router.push("/adminvisitor");
          getApartments();
          getAllVisitors();
        } else {
         router.push("/home");
          getApartments();
          getMyVisitors();
        // router.push("/adminvisitor");
        //   getApartments();
        //   getAllVisitors();
        }
      }
    } catch (error) {
      alert("Invalid credentials");
      console.error("Error logging in user:", error);
    }
  };



  const getApartments = async () => {
    try {
     
      const response = await axios.get('api/apartments');
      if (response.status === 200) {
        setApartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };
  
  const insertVisitor = async (apartmentId, visitorName, phoneNumber, entryDate, exitDate) => {
    try {
     
      const response = await axios.post(
        'api/visitors',
        {
          apartmentId,
          visitorName,
          phoneNumber,
          entryDate,
          exitDate,
        },
      );
      if (response.status === 201) {
        setVtoken(response.data.uniqueCode);
        await getMyVisitors();
        return response.data.uniqueCode;
      }
    } catch (error) {
      alert("Error adding visitor");
      console.error("Error adding visitor:", error);
    }
  };

  const getMyVisitors = async () => {
    try {
     
      const response = await axios.get('api/myvisitors');
      if (response.status === 200) {
        setVisitors(response.data);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };
  
  const createApartment = async (name) => {
    try {
      
      const response = await axios.post(
        'api/apartments',
        { name },
        
      );
      if (response.status === 201) {
        getApartments(); // Refresh the list of apartments
      }
    } catch (error) {
      alert("Error creating apartment");
      console.error("Error creating apartment:", error);
    }
  };

  const deleteApartment = async (id) => {
    try {
       console.log(id);
      const response = await axios.delete(`api/apartments/${id}`);
      if (response.status === 200) {
        getApartments(); // Refresh the list of apartments
      }
    } catch (error) {
      alert("Error deleting apartment");
      console.error("Error deleting apartment:", error);
    }
  };

  const editApartment = async (apartmentId, name) => {
    try {
     
      const response = await axios.put(
        `api/apartments/${apartmentId}`,
         { name },
        
      );
      if (response.status === 200) {
        getApartments(); // Refresh the list of apartments
      }
    } catch (error) {
      alert("Error editing apartment");
      console.error("Error editing apartment:", error);
    }
  };

  const getAllVisitors = async () => {
    try {
      
      const response = await axios.get('api/visitors');
      if (response.status === 200) {
        console.log(response.data)
        setAllVisitors(response.data);
      }
    } catch (error) {
      console.error("Error fetching all visitors:", error);
    }
  };

  

  const requestPasswordReset = async (email) => {
    try {
      await axios.post('api/request-password-reset', { email });
      alert("Password reset token sent to your email");
    } catch (error) {
      console.error(error);
      alert("Error sending password reset token");
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post('api/reset-password', { token, newPassword });
      alert("Password has been reset");
    } catch (error) {
      console.error(error);
      alert("Error resetting password");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        apartments,
        Vtoken,
        visitors,
        allVisitors,
        setUser,
        registerUser,
        loginUser,
        insertVisitor,
        createApartment,
        deleteApartment,
        editApartment,
       
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext };