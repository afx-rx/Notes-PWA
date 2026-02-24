/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Note } from './types';
import { cn } from './lib/utils';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(note => note.id === activeNoteId) || null;

  const onAddNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    // On mobile, close sidebar when creating a note to focus on editing
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const onDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  };

  const onUpdateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        return { ...note, ...updates, updatedAt: Date.now() };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-80 bg-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-gray-200 shadow-xl md:shadow-none",
          !isSidebarOpen && "-translate-x-full md:hidden" // Hide on mobile if closed
        )}
        style={{ 
          display: !isSidebarOpen && window.innerWidth >= 768 ? 'none' : 'block' 
        }}
      >
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={(id) => {
            setActiveNoteId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header / Toggle */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-100">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600">
            <Menu size={24} />
          </button>
          <span className="ml-2 font-semibold text-gray-900">
            {activeNote ? activeNote.title : 'Notes'}
          </span>
        </div>

        {/* Desktop Toggle (Optional, maybe floating or in a toolbar) */}
        <button 
          onClick={toggleSidebar}
          className={cn(
            "absolute top-4 left-4 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-500 hover:text-gray-900 hidden md:block transition-opacity",
            isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <Menu size={20} />
        </button>

        {activeNote ? (
          <Editor
            note={activeNote}
            onUpdateNote={onUpdateNote}
            className="h-full"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Menu size={32} className="text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-500">Select a note to view</p>
            <p className="text-sm mt-2">or create a new one</p>
            <button 
              onClick={onAddNote}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

