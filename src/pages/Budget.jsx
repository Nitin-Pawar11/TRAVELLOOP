import React, { useState } from 'react';
import { db } from '../services/db';
import { Wallet, PieChart, TrendingUp, DollarSign } from 'lucide-react';

export default function Budget() {
  const trips = db.getTrips();
  const totalBudget = trips.reduce((acc, t) => acc + Number(t.budget), 0);
  
  const expenses = {
    flights: totalBudget * 0.4,
    hotels: totalBudget * 0.3,
    food: totalBudget * 0.2,
    activities: totalBudget * 0.1
  };

  return (
    <div className="space-y-6 transition-colors">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Budget Overview</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Track your travel spending and manage trip budgets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-center transition-colors">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <Wallet size={24} />
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Total Planned Budget</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">${totalBudget.toLocaleString()}</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-center transition-colors">
           <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Estimated Expenses</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">${(totalBudget * 0.8).toLocaleString()}</h2>
        </div>

        <div className="bg-gradient-to-br from-primary to-blue-800 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg shadow-primary/20 dark:shadow-none text-white flex flex-col justify-center transition-colors border border-transparent dark:border-slate-600">
          <div className="w-12 h-12 bg-white/20 dark:bg-slate-700 text-white rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
            <DollarSign size={24} />
          </div>
          <p className="text-white/80 dark:text-slate-300 font-medium">Remaining Budget</p>
          <h2 className="text-4xl font-bold text-white mt-1">${(totalBudget * 0.2).toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><PieChart size={20} /> Expense Breakdown</h3>
          
          <div className="space-y-6">
            <ExpenseBar label="Flights & Transport" amount={expenses.flights} total={totalBudget} color="bg-blue-500" />
            <ExpenseBar label="Accommodation" amount={expenses.hotels} total={totalBudget} color="bg-indigo-500" />
            <ExpenseBar label="Food & Dining" amount={expenses.food} total={totalBudget} color="bg-orange-500" />
            <ExpenseBar label="Activities & Tours" amount={expenses.activities} total={totalBudget} color="bg-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trip Budgets</h3>
          <div className="space-y-4">
            {trips.length > 0 ? trips.map(trip => (
              <div key={trip.id} className="flex justify-between items-center p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{trip.destination}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(trip.startDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary dark:text-blue-400">${trip.budget}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded mt-1 inline-block">On track</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 dark:text-slate-400 text-center py-8">No trips planned to track budgets.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseBar({ label, amount, total, color }) {
  const percentage = total === 0 ? 0 : Math.round((amount / total) * 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-slate-300">{label}</span>
        <span className="font-bold text-gray-900 dark:text-white">${amount.toLocaleString()} <span className="text-gray-400 dark:text-slate-500 font-normal">({percentage}%)</span></span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
