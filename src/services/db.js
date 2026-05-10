export const db = {
  // Mock Users DB
  getUsers: () => JSON.parse(localStorage.getItem('traveloop_users') || '[]'),
  saveUser: (user) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem('traveloop_users', JSON.stringify(users));
  },
  
  // Current Session
  getCurrentUser: () => JSON.parse(localStorage.getItem('traveloop_session')),
  setCurrentUser: (user) => localStorage.setItem('traveloop_session', JSON.stringify(user)),
  logout: () => localStorage.removeItem('traveloop_session'),

  // Trips
  getTrips: () => JSON.parse(localStorage.getItem('traveloop_trips') || '[]'),
  saveTrip: (trip) => {
    const trips = db.getTrips();
    const newTrip = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...trip };
    trips.push(newTrip);
    localStorage.setItem('traveloop_trips', JSON.stringify(trips));
    return newTrip;
  },
  deleteTrip: (id) => {
    const trips = db.getTrips().filter(t => t.id !== id);
    localStorage.setItem('traveloop_trips', JSON.stringify(trips));
  },
  
  // Notes
  getNotes: () => JSON.parse(localStorage.getItem('traveloop_notes') || '[]'),
  saveNote: (note) => {
    const notes = db.getNotes();
    const newNote = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...note };
    notes.push(newNote);
    localStorage.setItem('traveloop_notes', JSON.stringify(notes));
    return newNote;
  },
  deleteNote: (id) => {
    const notes = db.getNotes().filter(n => n.id !== id);
    localStorage.setItem('traveloop_notes', JSON.stringify(notes));
  },

  // Settings & Preferences
  updateUser: (id, updates) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('traveloop_users', JSON.stringify(users));
      const current = db.getCurrentUser();
      if (current && current.id === id) {
        db.setCurrentUser(users[index]);
      }
      return users[index];
    }
    return null;
  },
  deleteUser: (id) => {
    const users = db.getUsers().filter(u => u.id !== id);
    localStorage.setItem('traveloop_users', JSON.stringify(users));
    db.logout();
  },
  getUserSettings: (userId) => {
    const settings = JSON.parse(localStorage.getItem('traveloop_settings') || '{}');
    if (!settings[userId]) {
      settings[userId] = {
        notifications: { email: true, push: false, tripReminders: true, budgetAlerts: true, recommendations: false, updates: true },
        preferences: { style: 'Adventure', budget: 'Medium', destinations: [], transport: 'Flight', hotel: 'Hotel', climate: 'Warm' },
        appearance: { theme: 'light', compact: false, language: 'English', currency: 'USD' },
        privacy: { privateProfile: false, tripVisibility: 'Friends', locationSharing: false }
      };
      localStorage.setItem('traveloop_settings', JSON.stringify(settings));
    }
    return settings[userId];
  },
  saveUserSettings: (userId, newSettings) => {
    const settings = JSON.parse(localStorage.getItem('traveloop_settings') || '{}');
    settings[userId] = { ...settings[userId], ...newSettings };
    localStorage.setItem('traveloop_settings', JSON.stringify(settings));
    return settings[userId];
  },
  getLoginHistory: (userId) => {
    const history = JSON.parse(localStorage.getItem('traveloop_history') || '{}');
    if (!history[userId]) {
      history[userId] = [{ id: 1, time: new Date().toISOString(), device: navigator.userAgent.substring(0, 50) + '...', ip: '192.168.1.5' }];
      localStorage.setItem('traveloop_history', JSON.stringify(history));
    }
    return history[userId];
  },

  // Search History
  getSearchHistory: (userId) => {
    const history = JSON.parse(localStorage.getItem('traveloop_search') || '{}');
    return history[userId] || [];
  },
  saveSearchHistory: (userId, term) => {
    if (!term) return;
    const history = JSON.parse(localStorage.getItem('traveloop_search') || '{}');
    let userHistory = history[userId] || [];
    userHistory = [term, ...userHistory.filter(t => t.name !== term.name)].slice(0, 5);
    history[userId] = userHistory;
    localStorage.setItem('traveloop_search', JSON.stringify(history));
  }
};
