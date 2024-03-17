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
  const loginAction = async (data) => {
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
  

  // Function to handle logout
  const logOut = () => {
    // Clear user and token states
    setUser(null);
    setToken("");

    // Remove cookies
    Cookies.remove("jwt-access");
    Cookies.remove("jwt-refresh");
    Cookies.remove("first_name");
    Cookies.remove("is_fr");

    // Navigate to the login page
    navigate("/login");
  };

  // Provide token, user, loginAction, and logOut values to the context
  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
