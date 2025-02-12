import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { CompanyProvider } from '../contexts/CompanyContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanyProvider>
          <Outlet />
        </CompanyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
