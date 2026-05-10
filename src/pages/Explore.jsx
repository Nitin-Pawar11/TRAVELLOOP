import React from 'react';
import InteractiveMap from '../components/InteractiveMap';

export default function Explore() {
  return (
    <div className="space-y-6 h-full flex flex-col transition-colors">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Explore Destinations</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Discover new places, hidden gems, and plan your next journey.</p>
      </div>

      <div className="flex-1">
        <InteractiveMap />
      </div>
    </div>
  );
}
