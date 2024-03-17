import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from './components/auth_provider';
import { useAuth } from './components/auth_provider'; // Import useAuth hook

import Login from './components/login';
import Signup from './components/signup';
import PrivateRoute from './components/protected_route';
import Homepage from './components/home';
import Cookies from 'js-cookie';

function App() {
  const user = Cookies.get('jwt-access'); // Get user from useAuth hook

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="content">
          <Routes>
            {/* Redirect sign-in and sign-up routes if user exists */}
            <Route path="/login" element={user ? <Homepage/>: <Login />} />
            <Route path="/signup" element={user? <Homepage/> : <Signup />} />
            
            {/* Use PrivateRoute for protecting the homepage */}
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
