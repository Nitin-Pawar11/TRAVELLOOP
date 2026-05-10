import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Calendar, Wallet, MapPin, ArrowLeft, MoreHorizontal, Plane } from 'lucide-react';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const trips = db.getTrips();
    const found = trips.find(t => t.id === id);
    if (found) setTrip(found);
  }, [id]);

  if (!trip) {
    return (
      <div className="text-center py-20 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trip not found</h2>
        <Link to="/trips" className="text-primary dark:text-blue-400 mt-4 inline-block hover:underline">Back to My Trips</Link>
      </div>
    );
  }

  const tabs = ['overview', 'itinerary', 'budget', 'notes', 'map'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 transition-colors">
      <Link to="/trips" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Trips
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="h-64 md:h-80 relative">
          <img src={trip.image || `https://source.unsplash.com/1200x600/?${encodeURIComponent(trip.destination)}`} alt={trip.destination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
             <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              {trip.travelType}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
              <MapPin className="text-primary dark:text-blue-400" /> {trip.destination}
            </h1>
            <div className="flex items-center gap-6 text-white/90 text-sm md:text-base font-medium">
              <span className="flex items-center gap-1.5"><Calendar size={18} /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Wallet size={18} /> ${trip.budget}</span>
            </div>
          </div>
          <div className="absolute top-6 right-6">
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-100 dark:border-slate-700 flex overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold capitalize transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab ? 'border-primary dark:border-blue-500 text-primary dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="col-span-2 space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Overview</h3>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-lg">
                      Get ready for your exciting {trip.travelType} trip to {trip.destination}. This itinerary covers the main highlights and gives you a structured way to track your daily plans and budget.
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border border-gray-100 dark:border-slate-600">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Plane className="text-primary dark:text-blue-400" size={20} /> Flight Details</h4>
                      <div className="text-sm text-gray-500 dark:text-slate-400 space-y-2">
                        <p>No flights added yet.</p>
                        <button className="text-primary dark:text-blue-400 font-medium hover:underline">Add Flight Information</button>
                      </div>
                    </div>
                 </div>
                 <div>
                    <div className="bg-primary/5 dark:bg-blue-500/10 rounded-xl p-6 border border-primary/10 dark:border-blue-500/20">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-primary dark:hover:border-blue-400 transition-colors">Add Accommodation</button>
                        <button className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-primary dark:hover:border-blue-400 transition-colors">Book Activities</button>
                        <button className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:border-primary dark:hover:border-blue-400 transition-colors">Share Itinerary</button>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
             <div className="flex flex-col items-center justify-center h-64 text-center animate-in fade-in">
               <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
                 <span className="text-2xl font-bold capitalize">{tab.charAt(0)}</span>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize">{tab} module in progress</h3>
               <p className="text-gray-500 dark:text-slate-400">This feature would be fully implemented in the next iteration.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
