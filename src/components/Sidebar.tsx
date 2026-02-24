import { Note } from '../types';
import { cn } from '../lib/utils';
import { Plus, Search } from 'lucide-react';
import { NoteItem } from './NoteItem';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (e: React.MouseEvent, id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  className?: string;
}

export function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  searchQuery,
  setSearchQuery,
  className
}: SidebarProps) {
  const filteredNotes = notes.filter(note => 
    (note.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (note.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={cn("flex flex-col h-full bg-white border-r border-gray-200", className)}>
      <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Notes</h1>
          <button
            onClick={onAddNote}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm active:scale-95"
            aria-label="Create new note"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {searchQuery ? "No notes found" : "Create your first note"}
          </div>
        ) : (
          filteredNotes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
              onDelete={onDeleteNote}
            />
          ))
        )}
      </div>
    </aside>
  );
}
