/* eslint-disable */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import Loader from '@/app/[lang]/(dashboard)/(private)/dashboards/loader';
import animationData from '../../public/loadbar.json'



const AuthGuard = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const router = useRouter();
  
    useEffect(() => {
      const checkAuthentication = async () => {
      const storedToken = localStorage.getItem('authToken'); // Get token from localStorage

      if (!storedToken) {
        setIsAuthenticated(false);
        router.push('/login');
        return;
      }
      try {
        const { exp } = JSON.parse(atob(storedToken.split('.')[1]));
        console.log(Date.now(),exp);
        
        if (Date.now() >= exp * 1000) {
          throw new Error('Token expired');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        router.push('/login');
      }

      setIsAuthenticated(true);
      };
  
      checkAuthentication();
    }, [router]);
  
    if (isAuthenticated === null) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Lottie animationData={animationData} style={{ height: 300, width: 300 }} />
        </div>
      );
    }
  
      return <>{isAuthenticated && children}</>;
  };
  
  export default AuthGuard;
