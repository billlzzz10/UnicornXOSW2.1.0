import React, { useState, useEffect } from 'react';
import { Note, NoteStatus } from '../../types';
import Icon from './Icon';
import { NOTE_CATEGORIES, DEFAULT_NOTE_STATUS } from '../../constants';
import { generateToc, correctMarkdown } from '../../utils';

interface NoteEditorModalProps {
  isOpen: boolean;
  noteToEdit?: Partial<Note> | null;
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> | Note) => void;
  currentProjectId: string;
}

const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  noteToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<NoteStatus>(DEFAULT_NOTE_STATUS);

  useEffect(() => {
    if (isOpen && noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
      setCategory(noteToEdit.category || '');
      setStatus(noteToEdit.status || DEFAULT_NOTE_STATUS);
    } else if (isOpen) {
      setTitle('');
      setContent('');
      setCategory('');
      setStatus(DEFAULT_NOTE_STATUS);
    }
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const noteData = {
      ...noteToEdit,
      title: title || 'Untitled Note',
      content,
      category,
      status,
    };
    onSave(noteData as Note);
    onClose();
  };

  const handleGenerateToc = () => {
    const { tocMarkdown, newContent } = generateToc(content);
    const finalContent = `${tocMarkdown}\n\n---\n\n${newContent}`;
    setContent(finalContent);
  };

  const handleCorrectMarkdown = () => {
    const correctedContent = correctMarkdown(content);
    setContent(correctedContent);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-paper-bg rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {noteToEdit?.id ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface">
            <Icon name="times" />
          </button>
        </header>
        <main className="p-6 space-y-4 overflow-y-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full p-2 bg-surface border border-border rounded-md"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full p-2 bg-surface border border-border rounded-md h-64"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 bg-surface border border-border rounded-md">
            <option value="">Select a category</option>
            {NOTE_CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.label}</option>)}
          </select>
        </main>
        <footer className="p-4 border-t border-border flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={handleGenerateToc} className="px-3 py-2 rounded-md hover:bg-surface text-text-secondary border border-border text-xs">
              <Icon name="list-ol" /> Generate TOC
            </button>
            <button onClick={handleCorrectMarkdown} className="px-3 py-2 rounded-md hover:bg-surface text-text-secondary border border-border text-xs">
              <Icon name="magic-wand-sparkles" /> Auto-Correct
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-md hover:bg-surface">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-white">Save Note</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NoteEditorModal;
