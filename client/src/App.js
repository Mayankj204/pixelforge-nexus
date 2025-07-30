import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
// import { Toaster } from 'react-hot-toast'; // --- TEMPORARILY REMOVED
// import 'react-loading-skeleton/dist/skeleton.css'; // --- TEMPORARILY REMOVED

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectDetails from './components/ProjectDetails';
import AccountSettings from './components/AccountSettings';

const AppContent = () => {
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, loading } = authState;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Application...</div>;
  }

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
          <Route path="/project/:id" element={isAuthenticated ? <ProjectDetails /> : <Login />} />
          <Route path="/account-settings" element={isAuthenticated ? <AccountSettings /> : <Login />} />
        </Routes>
      </main>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* <Toaster /> --- TEMPORARILY REMOVED */}
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;