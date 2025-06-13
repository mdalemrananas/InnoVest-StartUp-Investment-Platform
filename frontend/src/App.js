import React from 'react';
import { Routes, Route } from 'react-router-dom';
//Home and Layout
import Layout from './components/shared/Layout';
import Home from './components/Home';
//Authentication
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
//Companies
import BrowseCompanies from './components/company/BrowseCompanies';
import CompanyDetails from './components/company/CompanyDetails';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/browse-companies" element={<BrowseCompanies />} />
      </Routes>
    </Layout>
  );
}

export default App; 