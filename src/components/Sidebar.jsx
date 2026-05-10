import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plane, Map as MapIcon, Wallet, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Trips', path: '/trips', icon: Plane },
    { name: 'Explore', path: '/explore', icon: MapIcon },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-screen sticky top-0 flex flex-col shadow-sm hidden md:flex z-20 transition-colors">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary dark:text-blue-400 tracking-tight flex items-center gap-2">
          <Plane className="rotate-45" size={28} />
          Traveloop
        </h1>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive 
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
