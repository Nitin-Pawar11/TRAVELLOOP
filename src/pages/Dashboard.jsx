import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Calendar, MapPin, ArrowRight, Plane, Wallet, Users } from 'lucide-react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { openCreateTrip } = useOutletContext();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  const loadTrips = () => setTrips(db.getTrips());

  useEffect(() => {
    loadTrips();
    window.addEventListener('tripCreated', loadTrips);
    return () => window.removeEventListener('tripCreated', loadTrips);
  }, []);

  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date()).sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
  const recentTrips = [...trips].reverse().slice(0, 3);

  return (
    <div className="space-y-8 pb-8 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back, {currentUser?.name?.split(' ')[0] || 'Traveler'} 👋</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Here is what's happening with your travel plans today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Plane className="text-blue-500" />} title="Total Trips" value={trips.length} bgColor="bg-blue-50 dark:bg-blue-500/10" />
        <StatCard icon={<MapPin className="text-green-500" />} title="Upcoming" value={upcomingTrips.length} bgColor="bg-green-50 dark:bg-green-500/10" />
        <StatCard icon={<Users className="text-purple-500" />} title="Countries" value={new Set(trips.map(t=>t.destination)).size} bgColor="bg-purple-50 dark:bg-purple-500/10" />
        <StatCard icon={<Wallet className="text-amber-500" />} title="Total Budget" value={`$${trips.reduce((acc, t) => acc + Number(t.budget), 0)}`} bgColor="bg-amber-50 dark:bg-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Trips</h2>
              <Link to="/trips" className="text-sm font-medium text-primary dark:text-blue-400 hover:opacity-80 flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            {upcomingTrips.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrips.slice(0, 2).map((trip) => (
                  <div key={trip.id} className="flex items-center p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:border-primary/30 dark:hover:border-blue-400/30 transition-colors group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-slate-700">
                      <img src={trip.image || `https://source.unsplash.com/200x200/?${encodeURIComponent(trip.destination)}`} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{trip.destination}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Wallet size={14} /> ${trip.budget}</span>
                      </div>
                    </div>
                    <Link to={`/trips/${trip.id}`} className="px-4 py-2 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                <Plane className="mx-auto text-gray-400 dark:text-slate-500 mb-3" size={32} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No upcoming trips</h3>
                <p className="text-gray-500 dark:text-slate-400 mb-4 mt-1">Time to plan your next adventure!</p>
                <button onClick={openCreateTrip} className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary/90 transition-all">
                  Plan a Trip
                </button>
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Travel Map Overview</h2>
              <Link to="/explore" className="text-sm font-medium text-primary dark:text-blue-400 hover:opacity-80 flex items-center gap-1">
                Explore Map <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-gray-100 dark:bg-slate-900 rounded-xl h-[300px] overflow-hidden relative group cursor-pointer" onClick={() => navigate('/explore')}>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Map Preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2"><MapPin size={20} /> Discover New Places</h3>
                  <p className="text-white/80 mt-1">Interactive map with live destination data</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {recentTrips.length > 0 ? recentTrips.map((trip, i) => (
                <div key={trip.id} className="flex relative">
                  {i !== recentTrips.length - 1 && <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-gray-200 dark:bg-slate-700"></div>}
                  <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-primary dark:border-blue-500 flex items-center justify-center shrink-0 mt-1 z-10">
                    <div className="w-2 h-2 bg-primary dark:bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Planned a trip to <span className="font-bold">{trip.destination}</span></p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-4">No recent activity.</p>
              )}
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-accent dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2">Traveloop Pro</h3>
               <p className="text-white/80 text-sm mb-4">Get unlimited AI trip generation, offline maps, and more.</p>
               <button className="bg-white text-primary dark:text-slate-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors w-full">
                 Upgrade Now
               </button>
             </div>
             <Plane className="absolute -bottom-4 -right-4 text-white/20 w-32 h-32 rotate-12" />
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
