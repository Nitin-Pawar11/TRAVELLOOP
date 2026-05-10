import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { FileText, Plus, Trash2, Calendar } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    setNotes(db.getNotes());
  }, []);

  const handleSave = () => {
    if (!newNote.title || !newNote.content) return;
    db.saveNote(newNote);
    setNotes(db.getNotes());
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    db.deleteNote(id);
    setNotes(db.getNotes());
  };

  return (
    <div className="space-y-6 max-w-5xl transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Travel Notes</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Jot down ideas, packing lists, and journal entries.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Note
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-primary/30 dark:border-blue-500/30 animate-in slide-in-from-top-4 transition-colors">
          <input 
            type="text" 
            placeholder="Note Title" 
            value={newNote.title}
            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
            className="w-full text-xl font-bold border-b border-gray-100 dark:border-slate-700 pb-3 mb-4 focus:outline-none focus:border-primary dark:focus:border-blue-500 transition-colors bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
            autoFocus
          />
          <textarea 
            placeholder="Start typing your note here..." 
            value={newNote.content}
            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
            className="w-full h-32 resize-none focus:outline-none text-gray-700 dark:text-slate-300 bg-transparent placeholder-gray-400 dark:placeholder-slate-500"
          ></textarea>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 bg-primary text-white rounded-lg font-medium shadow-md hover:bg-primary/90 transition-all">Save Note</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map(note => (
          <div key={note.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all group relative">
            <button onClick={() => handleDelete(note.id)} className="absolute top-6 right-6 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={18} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-8">{note.title}</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 mb-4 flex items-center gap-1"><Calendar size={12}/> {new Date(note.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
            <FileText className="mx-auto text-gray-300 dark:text-slate-600 mb-4" size={48} />
            <p className="text-gray-500 dark:text-slate-400 font-medium">No notes yet. Create one to keep track of your thoughts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
