import React from 'react';
import { Note, NoteCategory } from '../../../types';
import { NOTE_CATEGORIES, NOTE_DISPLAY_OPTIONS, NoteDisplayFormat } from '../../../constants';
import Icon from '../Icon';

interface NotesViewProps {
  notes: Note[];
  onOpenNoteEditor: (noteData?: Partial<Note> | Note) => void;
  deleteNote: (noteId: string) => void;
}

const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onOpenNoteEditor,
  deleteNote,
}) => {
  const [displayFormat, setDisplayFormat] = React.useState<NoteDisplayFormat>('grid');

  const handleAddNewNote = () => {
    onOpenNoteEditor();
  };

  const handleEditNote = (note: Note) => {
    onOpenNoteEditor(note);
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center">
            <Icon name="notebook" className="w-6 h-6 text-primary mr-3" />
            Notes
          </h1>
          <p className="text-text-secondary">Your personal space for ideas and stories.</p>
        </div>
        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <div className="flex items-center bg-surface rounded-md p-0.5 border border-border">
            {NOTE_DISPLAY_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setDisplayFormat(opt.key)}
                title={opt.label}
                className={`p-2 w-9 h-9 flex items-center justify-center rounded-md transition-colors ${displayFormat === opt.key ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg-subtle'}`}
              >
                <Icon name={opt.icon as any} className="w-5 h-5" />
              </button>
            ))}
          </div>
          <button onClick={handleAddNewNote} className="px-4 py-2 rounded-md transition-all duration-200 flex items-center text-sm font-medium bg-primary text-white">
            <Icon name="plus" className="w-4 h-4 mr-2" />
            New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div
            key={note.id}
            className="note-card group relative flex flex-col h-full bg-surface text-text-primary rounded-xl shadow-card border border-border/50 hover:border-primary/30 hover:-translate-y-px transition-all duration-300 ease-in-out cursor-pointer p-4"
            onClick={() => handleEditNote(note)}
          >
            <div className="flex-grow flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-heading font-semibold truncate" title={note.title}>{note.title}</h3>
                <button
                  className="p-1.5 w-7 h-7 flex items-center justify-center text-text-secondary opacity-0 group-hover:opacity-100 rounded-full hover:bg-error/10 hover:text-error transition-colors"
                  onClick={(e) => handleDeleteNote(e, note.id)}
                  aria-label={`Delete ${note.title}`}
                >
                  <Icon name="trash-2" className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm opacity-90 line-clamp-3 flex-grow">
                {note.content.substring(0, 150)}
              </p>
            </div>
            <div className="mt-auto pt-3 flex items-center justify-between text-xs opacity-70 border-t border-border/50">
                <span>{note.category}</span>
                <span>{note.wordCount ? `${note.wordCount} words` : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesView;