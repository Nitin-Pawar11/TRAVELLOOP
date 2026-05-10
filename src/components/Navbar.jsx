import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, MapPin, History, Star, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { useNavigate } from 'react-router-dom';

const SEARCH_DATA = [
  { id: 1, name: "Paris", country: "France", type: "city", rating: 4.8, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format", lat: 48.8566, lng: 2.3522, desc: "City of Light, iconic Eiffel Tower." },
  { id: 2, name: "Tokyo", country: "Japan", type: "city", rating: 4.9, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&auto=format", lat: 35.6762, lng: 139.6503, desc: "Ultramodern and traditional mix." },
  { id: 3, name: "New York", country: "USA", type: "city", rating: 4.7, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&auto=format", lat: 40.7128, lng: -74.0060, desc: "The city that never sleeps." },
  { id: 4, name: "Bali", country: "Indonesia", type: "beach", rating: 4.8, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format", lat: -8.4095, lng: 115.1889, desc: "Tropical paradise." },
  { id: 5, name: "Rome", country: "Italy", type: "city", rating: 4.9, img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&auto=format", lat: 41.9028, lng: 12.4964, desc: "Capital of the Roman Empire." },
  { id: 6, name: "Dubai", country: "UAE", type: "city", rating: 4.6, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&auto=format", lat: 25.2048, lng: 55.2708, desc: "Luxury shopping & modern architecture." },
  { id: 7, name: "Goa", country: "India", type: "beach", rating: 4.5, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format", lat: 15.2993, lng: 74.1240, desc: "Sandy beaches & nightlife." },
  { id: 8, name: "Swiss Alps", country: "Switzerland", type: "mountain", rating: 4.9, img: "https://images.unsplash.com/photo-1531366936337-77cf5e08ce27?w=500&auto=format", lat: 46.5595, lng: 8.5583, desc: "Majestic snowy peaks and skiing." },
  { id: 9, name: "Eiffel Tower", country: "France", type: "landmark", rating: 4.8, img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&auto=format", lat: 48.8584, lng: 2.2945, desc: "World-famous iron monument." },
];

export default function Navbar({ onCreateTrip }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const history = currentUser ? db.getSearchHistory(currentUser.id) : [];

  const results = searchQuery 
    ? SEARCH_DATA.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (place) => {
    if (currentUser) db.saveSearchHistory(currentUser.id, { name: place.name, type: place.type, country: place.country });
    setSearchQuery('');
    setIsFocused(false);
    navigate(`/explore?lat=${place.lat}&lng=${place.lng}&name=${encodeURIComponent(place.name)}`);
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsFocused(true);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-24 px-8 flex items-center justify-between sticky top-0 z-50 transition-colors">
      
      {/* Massive Search Bar */}
      <div className="flex-1 max-w-3xl relative" ref={searchRef}>
        <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'shadow-2xl shadow-primary/10 ring-4 ring-primary/20 scale-[1.02]' : 'shadow-md shadow-gray-200/50 dark:shadow-none'}`}>
          <Search className={`absolute left-5 ${isFocused ? 'text-primary' : 'text-gray-400 dark:text-slate-500'}`} size={24} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search any city, country, beach, mountain, or attraction..." 
            className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 rounded-2xl pl-14 pr-12 py-4 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 font-medium text-lg outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={handleClear} className="absolute right-5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Dynamic Dropdown */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 z-[100]">
            
            {/* When typing, show live results */}
            {searchQuery ? (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    <h3 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Results</h3>
                    {results.map((place) => (
                      <div 
                        key={place.id} 
                        onClick={() => handleSelect(place)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                            {place.name}
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">{place.type}</span>
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={14}/> {place.country}</p>
                        </div>
                        <div className="text-right pr-4">
                           <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-slate-100"><Star size={14} className="fill-accent text-accent"/> {place.rating}</div>
                           <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors mt-1 inline-block" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-gray-500 dark:text-slate-400">
                    <Search size={32} className="mx-auto mb-3 opacity-20" />
                    <p>No destinations found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              /* Initial State: Recent & Recommended */
              <div className="p-6 flex flex-col md:flex-row gap-8">
                {/* Recent Searches */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2"><History size={16}/> Recent Searches</h3>
                  {history.length > 0 ? (
                    <div className="space-y-2">
                      {history.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer text-gray-700 dark:text-slate-300">
                          <History size={16} className="text-gray-400" />
                          <span className="font-medium">{h.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">{h.country}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-slate-400">No recent searches.</p>
                  )}
                </div>

                {/* Trending Places */}
                <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2"><Star size={16} className="text-accent fill-accent"/> Trending Now</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {SEARCH_DATA.slice(0, 4).map(place => (
                      <div key={place.id} onClick={() => handleSelect(place)} className="relative h-20 rounded-xl overflow-hidden cursor-pointer group">
                        <img src={place.img} alt={place.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute bottom-2 left-2 text-white font-bold text-sm z-10">{place.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6 ml-6">
        <button 
          onClick={onCreateTrip}
          className="hidden lg:flex bg-primary text-white px-6 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 items-center gap-2 text-sm"
        >
          <span>Create Trip</span>
        </button>

        <button className="relative text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-slate-700 cursor-pointer">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{currentUser?.name || 'Traveler'}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Pro Explorer</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-md text-lg ring-4 ring-gray-50 dark:ring-slate-800">
            {(currentUser?.name || 'T')[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
