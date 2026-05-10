import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-900 transition-colors">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
          alt="Travel Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/90 dark:via-slate-900/90 to-background dark:to-slate-900" />
      </div>

      <div className="z-10 w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 mx-4 h-[650px] transition-colors">
        
        <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 p-12 flex flex-col justify-center transition-colors">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-textMuted dark:text-slate-400 mb-8">Join Traveloop to start planning.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${error && error.includes('fields') ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-500`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-slate-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${error && error.includes('Email') ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-500`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${error && error.toLowerCase().includes('password') ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-500`}
                    placeholder="Create a password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-slate-300 mb-1">Confirm Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${error && error.includes('match') ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-500`}
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm animate-pulse flex items-center">
                   <span className="bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-md w-full border border-red-200 dark:border-red-500/20">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary dark:bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center mt-4 shadow-lg shadow-primary/30"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-textMuted dark:text-slate-400 text-sm">
              Already have an account? <Link to="/login" className="text-primary dark:text-blue-400 font-semibold hover:underline">Log In</Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center w-1/2 p-12 text-text dark:text-white relative overflow-hidden bg-primary/5 dark:bg-slate-900/50">
          <div className="z-10 text-right w-full">
            <h1 className="text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">Traveloop</h1>
            <p className="text-2xl font-light text-textMuted dark:text-slate-300">Start your adventure today.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
