import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { User, Lock, Bell, Globe, Shield, Smartphone, HardDrive, LogOut, Check, Loader2, Download } from 'lucide-react';

export default function Settings() {
  const { currentUser, logout, updateProfile, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setSettings(db.getUserSettings(currentUser.id));
    }
  }, [currentUser]);

  const handleSettingChange = (section, key, value) => {
    const updatedSettings = {
      ...settings,
      [section]: { ...settings[section], [key]: value }
    };
    setSettings(updatedSettings);
    
    setIsSaving(true);
    setTimeout(() => {
      db.saveUserSettings(currentUser.id, updatedSettings);
      setIsSaving(false);
      setSaveSuccess(true);
      
      if (section === 'appearance' && key === 'theme') {
        if (value === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }

      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const navItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'preferences', icon: Globe, label: 'Travel Preferences' },
    { id: 'appearance', icon: Smartphone, label: 'Appearance' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'data', icon: HardDrive, label: 'Data & Backup' },
  ];

  if (!settings) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 transition-colors">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your account preferences and security.</p>
        </div>
        <div className="h-10 flex items-center">
          {isSaving && <span className="flex items-center text-sm text-gray-500 dark:text-slate-400"><Loader2 size={16} className="animate-spin mr-2" /> Saving changes...</span>}
          {saveSuccess && !isSaving && <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium"><Check size={16} className="mr-2" /> Saved</span>}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row min-h-[600px] transition-colors">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50/50 dark:bg-slate-900/50 border-r border-gray-100 dark:border-slate-700 flex flex-col shrink-0">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {(currentUser?.name || 'T')[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-900 dark:text-white truncate">{currentUser?.name}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
                  activeTab === item.id 
                    ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' 
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 bg-white dark:bg-slate-800 overflow-y-auto transition-colors">
          
          {activeTab === 'profile' && (
            <ProfileSection user={currentUser} updateProfile={updateProfile} setIsSaving={setIsSaving} setSaveSuccess={setSaveSuccess} />
          )}

          {activeTab === 'security' && (
            <SecuritySection user={currentUser} updateProfile={updateProfile} />
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-gray-500 dark:text-slate-400">Choose how and when you want to be notified.</p>
              </div>
              
              <div className="space-y-4">
                <ToggleRow label="Email Notifications" description="Receive trip summaries and alerts via email." 
                  checked={settings.notifications.email} onChange={(v) => handleSettingChange('notifications', 'email', v)} />
                <ToggleRow label="Push Notifications" description="Get instant alerts on your devices." 
                  checked={settings.notifications.push} onChange={(v) => handleSettingChange('notifications', 'push', v)} />
                <hr className="border-gray-100 dark:border-slate-700 my-4" />
                <ToggleRow label="Trip Reminders" description="Reminders a few days before your trip begins." 
                  checked={settings.notifications.tripReminders} onChange={(v) => handleSettingChange('notifications', 'tripReminders', v)} />
                <ToggleRow label="Budget Alerts" description="Get notified when you approach your budget limit." 
                  checked={settings.notifications.budgetAlerts} onChange={(v) => handleSettingChange('notifications', 'budgetAlerts', v)} />
                <ToggleRow label="Destination Recommendations" description="Curated travel ideas based on your preferences." 
                  checked={settings.notifications.recommendations} onChange={(v) => handleSettingChange('notifications', 'recommendations', v)} />
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Preferences</h2>
                <p className="text-gray-500 dark:text-slate-400">Customize Traveloop to match your unique travel style.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Travel Style" value={settings.preferences.style} onChange={(v) => handleSettingChange('preferences', 'style', v)}
                  options={['Adventure', 'Luxury', 'Backpacking', 'Family', 'Solo', 'Business']} />
                <SelectField label="Budget Range" value={settings.preferences.budget} onChange={(v) => handleSettingChange('preferences', 'budget', v)}
                  options={['Economy', 'Medium', 'Premium', 'Luxury']} />
                <SelectField label="Preferred Transport" value={settings.preferences.transport} onChange={(v) => handleSettingChange('preferences', 'transport', v)}
                  options={['Flight', 'Train', 'Bus', 'Car Rental', 'Cruise']} />
                <SelectField label="Accommodation" value={settings.preferences.hotel} onChange={(v) => handleSettingChange('preferences', 'hotel', v)}
                  options={['Hotel', 'Hostel', 'Resort', 'Airbnb/Rental', 'Camping']} />
                <SelectField label="Preferred Climate" value={settings.preferences.climate} onChange={(v) => handleSettingChange('preferences', 'climate', v)}
                  options={['Warm/Tropical', 'Cold/Snowy', 'Temperate', 'Mixed']} />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-gray-500 dark:text-slate-400">Customize how Traveloop looks and feels.</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Theme</label>
                  <div className="flex gap-4">
                    <button onClick={() => handleSettingChange('appearance', 'theme', 'light')} className={`flex-1 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${settings.appearance.theme === 'light' ? 'border-primary dark:border-blue-500 bg-primary/5 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'}`}>
                      <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">☀️</div>
                      <span className="font-medium text-gray-900 dark:text-white">Light Mode</span>
                    </button>
                    <button onClick={() => handleSettingChange('appearance', 'theme', 'dark')} className={`flex-1 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${settings.appearance.theme === 'dark' ? 'border-primary dark:border-blue-500 bg-primary/5 dark:bg-blue-500/10' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'}`}>
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white">🌙</div>
                      <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <SelectField label="Language" value={settings.appearance.language} onChange={(v) => handleSettingChange('appearance', 'language', v)}
                    options={['English', 'Spanish', 'French', 'German', 'Japanese']} />
                  <SelectField label="Currency" value={settings.appearance.currency} onChange={(v) => handleSettingChange('appearance', 'currency', v)}
                    options={['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD']} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Data</h2>
                <p className="text-gray-500 dark:text-slate-400">Manage your data visibility and connected services.</p>
              </div>
              
              <div className="space-y-4">
                <ToggleRow label="Private Profile" description="Only approved followers can see your profile." 
                  checked={settings.privacy.privateProfile} onChange={(v) => handleSettingChange('privacy', 'privateProfile', v)} />
                <ToggleRow label="Location Sharing" description="Share live location with travel partners." 
                  checked={settings.privacy.locationSharing} onChange={(v) => handleSettingChange('privacy', 'locationSharing', v)} />
              </div>

              <div className="pt-8 border-t border-gray-100 dark:border-slate-700 mt-8">
                <h3 className="text-red-600 dark:text-red-400 font-bold mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. All trips, notes, and preferences will be permanently erased.</p>
                <button 
                  onClick={() => {
                    if(window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                      deleteAccount();
                    }
                  }}
                  className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6 animate-in fade-in">
               <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data & Backup</h2>
                <p className="text-gray-500 dark:text-slate-400">Export your travel history and notes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:border-primary/50 dark:hover:border-blue-500/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-blue-500/10 text-primary dark:text-blue-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Download size={20}/></div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Export as PDF</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Download a beautiful summary of all your trips.</p>
                </div>
                <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:border-primary/50 dark:hover:border-blue-500/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><HardDrive size={20}/></div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Export as JSON</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Download raw data backup of your account.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user, updateProfile, setIsSaving, setSaveSuccess }) {
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '', location: user?.location || '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateProfile(formData);
    setIsSaving(false);
    if(result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <p className="text-gray-500 dark:text-slate-400">Update your personal information.</p>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-slate-700">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
          {formData.name[0]?.toUpperCase() || 'T'}
        </div>
        <div>
          <button type="button" className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">Change Photo</button>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Full Name</label>
          <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary dark:focus:border-blue-500 transition-colors bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Email Address</label>
          <input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Phone Number</label>
          <input type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary dark:focus:border-blue-500 transition-colors bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Home Location</label>
          <input type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="e.g. New York, USA" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary dark:focus:border-blue-500 transition-colors bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Short Bio</label>
          <textarea value={formData.bio} onChange={e=>setFormData({...formData, bio: e.target.value})} placeholder="I love traveling to..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary dark:focus:border-blue-500 transition-colors bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 h-24 resize-none"></textarea>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <button type="submit" className="px-6 py-2.5 bg-primary dark:bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-primary/90 dark:hover:bg-blue-700 transition-all">Save Profile</button>
      </div>
    </form>
  );
}

function SecuritySection({ user, updateProfile }) {
  const [passData, setPassData] = useState({ current: '', newPass: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const history = db.getLoginHistory(user.id);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    if (passData.current !== user.password) {
      setError('Current password is incorrect');
      return;
    }
    if (passData.newPass.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (passData.newPass !== passData.confirm) {
      setError('New passwords do not match');
      return;
    }
    
    await updateProfile({ password: passData.newPass });
    setSuccess('Password updated successfully!');
    setPassData({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h2>
        <p className="text-gray-500 dark:text-slate-400">Keep your account secure.</p>
      </div>

      <form onSubmit={handlePasswordChange} className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-gray-100 dark:border-slate-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
        
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">{success}</div>}

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Current Password</label>
            <input type="password" value={passData.current} onChange={e=>setPassData({...passData, current: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary dark:focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">New Password</label>
            <input type="password" value={passData.newPass} onChange={e=>setPassData({...passData, newPass: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary dark:focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirm New Password</label>
            <input type="password" value={passData.confirm} onChange={e=>setPassData({...passData, confirm: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary dark:focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm">Update Password</button>
        </div>
      </form>

      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
        <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
          {history.map((h, i) => (
            <div key={i} className="p-4 border-b border-gray-100 dark:border-slate-700 last:border-0 flex justify-between items-center bg-white dark:bg-slate-800">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{h.device}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{h.ip} • {new Date(h.time).toLocaleString()}</p>
              </div>
              {i === 0 ? (
                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">Current</span>
              ) : (
                <button className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
      <div>
        <p className="font-bold text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-primary dark:bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ease-in-out ${checked ? 'translate-x-7' : 'translate-x-1'}`}></div>
      </button>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary dark:focus:border-blue-500 transition-colors bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100/50 dark:hover:bg-slate-600 cursor-pointer appearance-none"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
