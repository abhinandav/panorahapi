/* eslint-disable */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';



const AuthGuard = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const router = useRouter();
  
    useEffect(() => {
      const checkAuthentication = async () => {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
  
        if (!token) {
          router.push('/login'); // Redirect to login if no token
          return setIsAuthenticated(false);
        }

        setIsAuthenticated(true);
  
      };
  
      checkAuthentication();
    }, [router]);
  
    // Show a loading state while verifying authentication
    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Replace with a spinner or fallback UI
    }
  
    // Render children if authenticated
    return <>{isAuthenticated && children}</>;
  };
  
  export default AuthGuard;
