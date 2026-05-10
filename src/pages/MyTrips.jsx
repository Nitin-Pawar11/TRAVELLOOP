import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Calendar, Wallet, MoreVertical, Plane, MapPin, Trash2, Edit3 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const { openCreateTrip } = useOutletContext();

  const loadTrips = () => setTrips(db.getTrips());

  useEffect(() => {
    loadTrips();
    window.addEventListener('tripCreated', loadTrips);
    return () => window.removeEventListener('tripCreated', loadTrips);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      db.deleteTrip(id);
      loadTrips();
    }
  };

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Trips</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage and view all your planned adventures.</p>
        </div>
        <button 
          onClick={openCreateTrip}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
        >
          <Plane size={18} />
          Create Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
          <Plane className="mx-auto text-gray-300 dark:text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">No trips planned yet</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-6 mt-2 max-w-sm mx-auto">Start planning your first adventure to see it appear here.</p>
          <button onClick={openCreateTrip} className="px-6 py-3 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all">
            Plan a Trip Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden group transition-colors">
              <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-slate-700">
                <img 
                  src={trip.image || `https://source.unsplash.com/600x400/?${encodeURIComponent(trip.destination)}`} 
                  alt={trip.destination} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {trip.travelType}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin size={18} className="text-primary dark:text-blue-400" />
                      {trip.destination}
                    </h3>
                  </div>
                  <div className="relative group/menu">
                    <button className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 p-1">
                      <MoreVertical size={20} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl w-32 py-1 hidden group-hover/menu:block z-10">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(trip.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <Calendar size={16} className="mr-3 text-gray-400 dark:text-slate-500" />
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <Wallet size={16} className="mr-3 text-gray-400 dark:text-slate-500" />
                    Est. Budget: <span className="font-semibold text-gray-900 dark:text-white ml-1">${trip.budget}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
                    <span>Trip Progress</span>
                    <span>{trip.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary dark:bg-blue-500 rounded-full" style={{ width: `${trip.progress}%` }}></div>
                  </div>
                </div>

                <div className="mt-6">
                   <button className="w-full py-2.5 bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                     View Itinerary
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
