import React, { useState, useMemo } from 'react';
import { Note } from '../../../types';
import Icon from '../Icon';

/**
 * @interface ContextSelectorModalProps
 * @description Props for the ContextSelectorModal component.
 */
interface ContextSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onAddContext: (selectedNotes: Note[]) => void;
}

/**
 * A modal for selecting notes to use as context for the AI.
 * @param {ContextSelectorModalProps} props - The props for the component.
 */
const ContextSelectorModal: React.FC<ContextSelectorModalProps> = ({
  isOpen,
  onClose,
  notes,
  onAddContext,
}) => {
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, searchTerm]);

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNoteIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(noteId)) {
        newSelection.delete(noteId);
      } else {
        newSelection.add(noteId);
      }
      return newSelection;
    });
  };

  const handleConfirmAddContext = () => {
    const selectedNotes = notes.filter(note => selectedNoteIds.has(note.id));
    onAddContext(selectedNotes);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-bg rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <header className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Select Notes for Context</h3>
          <button onClick={onClose} className="p-2" aria-label="Close">
            <Icon name="times" />
          </button>
        </header>
        <main className="p-4 space-y-3 overflow-y-auto">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-surface"
          />
          <ul className="space-y-2">
            {filteredNotes.map(note => (
              <li key={note.id} className="p-2 rounded-md hover:bg-surface">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNoteIds.has(note.id)}
                    onChange={() => toggleNoteSelection(note.id)}
                    className="mr-3"
                  />
                  <span>{note.title}</span>
                </label>
              </li>
            ))}
          </ul>
        </main>
        <footer className="p-4 flex justify-end space-x-2 bg-bg-subtle rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 rounded-md">Cancel</button>
          <button
            onClick={handleConfirmAddContext}
            disabled={selectedNoteIds.size === 0}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Add Context ({selectedNoteIds.size})
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ContextSelectorModal;
