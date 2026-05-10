import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import Explore from './pages/Explore';
import Budget from './pages/Budget';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import TripDetails from './pages/TripDetails';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="trips" element={<MyTrips />} />
        <Route path="trips/:id" element={<TripDetails />} />
        <Route path="explore" element={<Explore />} />
        <Route path="budget" element={<Budget />} />
        <Route path="notes" element={<Notes />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
