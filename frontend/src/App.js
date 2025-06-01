import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Layout from './components/shared/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        {}
        <Route path="/login" element={<Login />} />
        {}
      </Routes>
    </Layout>
  );
}

export default App; 