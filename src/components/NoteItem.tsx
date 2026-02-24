import { Note } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export function NoteItem({ note, isActive, onClick, onDelete }: NoteItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-1 p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-gray-50",
        isActive && "bg-blue-50/50 hover:bg-blue-50/80 border-l-4 border-l-blue-500 border-b-transparent"
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className={cn("font-medium text-sm truncate pr-6", isActive ? "text-blue-900" : "text-gray-900")}>
          {note.title || "Untitled Note"}
        </h3>
        <button
          onClick={(e) => onDelete(e, note.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-500 absolute right-2 top-3"
          title="Delete note"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 h-8">
        {note.content || "No additional text"}
      </p>
      <span className="text-[10px] text-gray-400 font-mono mt-1">
        {formatDistanceToNow(note.createdAt, { addSuffix: true })}
      </span>
    </div>
  );
}
