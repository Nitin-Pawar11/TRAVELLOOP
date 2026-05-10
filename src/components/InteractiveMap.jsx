import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Navigation2, Star, DollarSign, X } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const mockLocations = [
  { id: 1, name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, desc: "City of Light, iconic Eiffel Tower, and world-class cuisine.", rating: 4.8, price: "$$$", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format" },
  { id: 2, name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, desc: "Bustling metropolis mixing ultramodern and traditional.", rating: 4.9, price: "$$$", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&auto=format" },
  { id: 3, name: "New York", country: "USA", lat: 40.7128, lng: -74.0060, desc: "The city that never sleeps. Times Square, Central Park.", rating: 4.7, price: "$$$", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&auto=format" },
  { id: 4, name: "Bali", country: "Indonesia", lat: -8.4095, lng: 115.1889, desc: "Tropical paradise with beaches, temples, and mountains.", rating: 4.8, price: "$$", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format" },
  { id: 5, name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, desc: "Capital of the Roman Empire, Colosseum, Vatican City.", rating: 4.9, price: "$$$", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&auto=format" },
  { id: 6, name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, desc: "Luxury shopping, modern architecture and lively nightlife.", rating: 4.6, price: "$$$$", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&auto=format" },
  { id: 7, name: "Goa", country: "India", lat: 15.2993, lng: 74.1240, desc: "Sandy beaches, vibrant nightlife, and Portuguese heritage.", rating: 4.5, price: "$", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format" },
  { id: 8, name: "Swiss Alps", country: "Switzerland", lat: 46.5595, lng: 8.5583, desc: "Majestic snowy peaks, skiing, and cozy mountain villages.", rating: 4.9, price: "$$$", img: "https://images.unsplash.com/photo-1531366936337-77cf5e08ce27?w=500&auto=format" },
  { id: 9, name: "Eiffel Tower", country: "France", lat: 48.8584, lng: 2.2945, desc: "The iconic wrought-iron lattice tower on the Champ de Mars.", rating: 4.8, price: "$$", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&auto=format" },
];

export default function InteractiveMap() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Sync map with global search URL params
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const name = searchParams.get('name');

    if (lat && lng) {
      setMapCenter([parseFloat(lat), parseFloat(lng)]);
      setMapZoom(12);
      
      const loc = mockLocations.find(l => l.name === name);
      if (loc) {
        setActiveLocation(loc);
      } else if (name) {
        // Fallback for custom search not in mock data
        setActiveLocation({
          id: 'custom', name, country: "Global Search", lat, lng,
          desc: `Explore the beautiful region of ${name}. Add it to your itinerary now.`,
          rating: 4.5, price: "$$", img: `https://source.unsplash.com/800x600/?${encodeURIComponent(name)},city`
        });
      }
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    const term = searchQuery.toLowerCase();
    const loc = mockLocations.find(l => 
      l.name.toLowerCase().includes(term) || 
      l.country.toLowerCase().includes(term)
    );

    if (loc) {
      setSearchParams({ lat: loc.lat, lng: loc.lng, name: loc.name });
    }
  };

  const handleLocationClick = (loc) => {
    setSearchParams({ lat: loc.lat, lng: loc.lng, name: loc.name });
  };

  const clearLocation = () => {
    setActiveLocation(null);
    setSearchParams({});
    setMapZoom(2);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 relative">
      
      {/* Map Container */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden relative z-0 transition-colors">
        
        {/* Local Map Search Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
          <form onSubmit={handleSearch} className="relative shadow-lg rounded-full overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Local map search..."
              className="w-full pl-12 pr-24 py-3.5 focus:outline-none bg-transparent text-gray-900 dark:text-slate-100 font-medium"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Find
            </button>
          </form>
        </div>

        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          {/* Using a CartoDB basemap that automatically adapts to dark mode via css filter on tiles if needed, but normally we just keep the map as is or use a dark tileset. */}
          <TileLayer
            className="map-tiles"
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {mockLocations.map((loc) => (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]}
              eventHandlers={{ click: () => handleLocationClick(loc) }}
            >
              <Popup className="custom-popup">
                <div className="font-sans">
                  <h3 className="font-bold text-gray-900">{loc.name}</h3>
                  <p className="text-gray-500 text-sm">{loc.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          {activeLocation && activeLocation.id === 'custom' && (
            <Marker position={[activeLocation.lat, activeLocation.lng]}>
              <Popup className="custom-popup"><h3 className="font-bold text-gray-900">{activeLocation.name}</h3></Popup>
            </Marker>
          )}
        </MapContainer>
        
        <style dangerouslySetInnerHTML={{__html: `
          .dark .map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
        `}} />
      </div>

      {/* Details Panel Overlay/Sidebar */}
      <div className={`w-full md:w-[400px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col shrink-0 transition-all duration-300 ${activeLocation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 hidden'}`}>
        {activeLocation && (
          <div className="h-full flex flex-col">
            <div className="h-64 shrink-0 relative">
              <img src={activeLocation.img} alt={activeLocation.name} className="w-full h-full object-cover" />
              <button onClick={clearLocation} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
                <span className="sr-only">Close</span>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeLocation.name}</h2>
                  <p className="text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1"><MapPin size={16} /> {activeLocation.country}</p>
                </div>
                <div className="bg-primary/10 text-primary dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star size={14} className="fill-current" /> {activeLocation.rating}
                </div>
              </div>

              <p className="text-gray-600 dark:text-slate-300 mt-4 leading-relaxed">{activeLocation.desc}</p>

              <div className="mt-6 flex items-center gap-6 border-y border-gray-100 dark:border-slate-700 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Est. Budget</p>
                    <p className="font-bold text-gray-900 dark:text-white">{activeLocation.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Navigation2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Weather</p>
                    <p className="font-bold text-gray-900 dark:text-white">24°C Sunny</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  <MapPin size={20} />
                  Add to Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
