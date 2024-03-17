import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from './components/auth_provider';


import Login from './components/login';
import Signup from './components/signup';
import PrivateRoute from './components/protected_route';
import Homepage from './components/home';

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        
        <div className="content"> {/* Add a wrapper div for content */}
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            {/* Use ProtectedRoute for the homepage */}
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Homepage />} />
            </Route>
            {/* Redirect to homepage for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
