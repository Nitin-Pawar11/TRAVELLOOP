import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CreateTripModal from './CreateTripModal';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';

export default function Layout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const settings = db.getUserSettings(currentUser.id);
      if (settings?.appearance?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [currentUser]);

  return (
    <div className="flex h-screen bg-background dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onCreateTrip={() => setIsCreateModalOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 dark:bg-slate-900/50">
          <div className="p-8 max-w-7xl mx-auto">
            <Outlet context={{ openCreateTrip: () => setIsCreateModalOpen(true) }} />
          </div>
        </main>
      </div>

      {isCreateModalOpen && (
        <CreateTripModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
