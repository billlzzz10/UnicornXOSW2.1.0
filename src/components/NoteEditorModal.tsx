import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteStatus } from '../../types';
import Icon from './Icon';
import { NOTE_CATEGORIES, DEFAULT_NOTE_STATUS } from '../../constants';

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
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const getAutoSaveKey = () => noteToEdit?.id ? `autosave_note_${noteToEdit.id}` : 'autosave_new_note';

  // Effect to load data from props or localStorage on open
  useEffect(() => {
    if (isOpen) {
      const autoSaveKey = getAutoSaveKey();
      const savedData = localStorage.getItem(autoSaveKey);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (window.confirm('พบข้อมูลที่ยังไม่ได้บันทึก คุณต้องการกู้คืนหรือไม่?')) {
            setTitle(parsedData.title || '');
            setContent(parsedData.content || '');
            setCategory(parsedData.category || '');
            setStatus(parsedData.status || DEFAULT_NOTE_STATUS);
            return;
          }
        } catch (e) {
          console.error("Failed to parse auto-saved data:", e);
          localStorage.removeItem(autoSaveKey);
        }
      }
      // If not restoring, load from props or reset
      setTitle(noteToEdit?.title || '');
      setContent(noteToEdit?.content || '');
      setCategory(noteToEdit?.category || '');
      setStatus(noteToEdit?.status || DEFAULT_NOTE_STATUS);
    }
  }, [noteToEdit, isOpen]);

  // Effect for auto-saving content to localStorage
  useEffect(() => {
    if (!isOpen) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const autoSaveKey = getAutoSaveKey();
      const dataToSave = JSON.stringify({ title, content, category, status });
      localStorage.setItem(autoSaveKey, dataToSave);
    }, 1000);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [title, content, category, status, isOpen]);

  const clearAutoSaveAndClose = () => {
    const autoSaveKey = getAutoSaveKey();
    localStorage.removeItem(autoSaveKey);
    onClose();
  };

  const handleSave = () => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const characterCount = content.length;
    const noteData = {
        ...noteToEdit,
        title,
        content,
        category,
        status,
        wordCount,
        characterCount,
        tags: noteToEdit?.tags || [],
    };
    onSave(noteData as Note);
    clearAutoSaveAndClose();
  };

  if (!isOpen) return null;

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = content.length;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold">{noteToEdit?.id ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={clearAutoSaveAndClose} className="p-1 hover:bg-border rounded-full">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </header>
        <main className="p-6 space-y-4 overflow-y-auto">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Note Title" className="w-full p-2 bg-bg-subtle border rounded" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full p-2 bg-bg-subtle border rounded h-64"
          />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 bg-bg-subtle border rounded">
            <option value="">Select a category</option>
            {NOTE_CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.label}</option>)}
          </select>
        </main>
        <footer className="p-4 border-t border-border flex justify-between items-center">
          <div className="text-xs text-text-secondary">
            <span>{wordCount} words</span>
            <span className="mx-2">·</span>
            <span>{characterCount.toLocaleString()} characters</span>
          </div>
          <div className="flex gap-3">
            <button onClick={clearAutoSaveAndClose} className="px-4 py-2 rounded hover:bg-border">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded">Save</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NoteEditorModal;