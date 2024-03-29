import axiosInstance from "../axios_config";
import Cookies from "js-cookie";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  // Initialize user and token states with data from cookies
  const [user, setUser] = useState({
    first_name: Cookies.get("first_name") || "",
    is_fr: Cookies.get("is_fr") === "true" || false
  });
  const [token, setToken] = useState(Cookies.get("jwt-access") || "");
  const navigate = useNavigate();

  // Effect to fetch user data from cookies when component mounts
  useEffect(() => {
    const userObject = {
      first_name: Cookies.get("first_name") || "",
      is_fr: Cookies.get("is_fr") === "true" || false
    };
    setUser(userObject);
  }, []);

  // Function to handle login action
  const signin = async (data) => {
    try {
      const response = await axiosInstance.post("signin", data);
      const responseData = await response.data;
  
      // Update user and token states with data from response
      const userObject = {
        first_name: responseData.user['first_name'] || "",
        is_fr: responseData.user['is_fr'] || false
      };
      setUser(userObject);
      setToken(responseData.access);
  
      // Set cookies with token and user data
      Cookies.set("jwt-access", responseData.access);
      Cookies.set("jwt-refresh", responseData.refresh);
      Cookies.set("first_name", responseData.user['first_name'] || "");
      Cookies.set("is_fr", responseData.user['is_fr'] || false);
  
      // Navigate to the homepage
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        // Server returned a specific error message
        throw new Error(error.response.data.error);
      } else {
        // Generic error
        throw new Error("Sign in failed");
      }
    }
  };
  const signup= async (body) => {

    console.log('signupppp');
    try {
      const response = await axiosInstance.post("signup", body);
      const responseData = await response.data;
  
     
     
        alert('Votre compte a été créé avec succès');
        navigate('/login', { replace: true });
      
    } catch (error) {
      console.error("Signup error:", error.response.data);
      if (error.response.data) {
       
        throw new Error('L\'identifiant existe déja');
      } else {
        // Generic error
        throw new Error("Erreur");
      }
    }
  };

  // Function to handle logout
  const signout = () => {
    // Clear user and token states
    setUser(null);
    setToken("");

    // Remove cookies
    Cookies.remove("jwt-access");
    Cookies.remove("jwt-refresh");
    Cookies.remove("first_name");
    Cookies.remove("is_fr");

    // Navigate to the login page
    navigate("/login",);
    location.reload();
  };

  // Provide token, user, loginAction, and logOut values to the context
  return (
    <AuthContext.Provider value={{ token, user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
