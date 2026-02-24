import { Note } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  className?: string;
}

export function Editor({ note, onUpdateNote, className }: EditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  if (!note) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-gray-50/50 text-gray-400", className)}>
        <p>Select a note to view or edit</p>
      </div>
    );
  }

  return (
    <main className={cn("flex flex-col h-full bg-white", className)}>
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
          placeholder="Untitled Note"
          className="text-3xl font-bold text-gray-900 placeholder:text-gray-300 bg-transparent border-none focus:outline-none w-full"
        />
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              isPreview 
                ? "bg-blue-100 text-blue-700" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isPreview ? (
          <div className="prose prose-slate max-w-none p-8">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={note.content}
            onChange={(e) => onUpdateNote(note.id, { content: e.target.value })}
            placeholder="Start typing..."
            className="w-full h-full p-8 resize-none focus:outline-none text-gray-700 leading-relaxed text-lg font-mono"
          />
        )}
      </div>
      
      <div className="px-8 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
        <span>{note.content.length} characters</span>
        <span>Last edited {new Date(note.updatedAt).toLocaleString()}</span>
      </div>
    </main>
  );
}
