import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (user) setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login delay
    await new Promise(r => setTimeout(r, 800));
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      db.setCurrentUser(user);
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Incorrect email or password.' };
  };

  const signup = async (name, email, password) => {
    await new Promise(r => setTimeout(r, 800));
    const users = db.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists.' };
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    db.saveUser(newUser);
    db.setCurrentUser(newUser);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    db.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    await new Promise(r => setTimeout(r, 500));
    const updatedUser = db.updateUser(currentUser.id, updates);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      return { success: true };
    }
    return { success: false, error: 'Failed to update profile' };
  };

  const deleteAccount = async () => {
    await new Promise(r => setTimeout(r, 800));
    db.deleteUser(currentUser.id);
    setCurrentUser(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, updateProfile, deleteAccount, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
