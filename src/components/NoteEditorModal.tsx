import React, { useState, useEffect, useRef } from 'react';
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
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const slashCommands = [
    { id: 'today', name: 'Insert Date', action: () => new Date().toLocaleDateString() },
    { id: 'h1', name: 'Heading 1', action: () => '# ' },
    { id: 'h2', name: 'Heading 2', action: () => '## ' },
    { id: 'todo', name: 'To-do List', action: () => '- [ ] ' },
  ];

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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (newContent.endsWith('/')) {
      setShowSlashCommands(true);
    } else {
      setShowSlashCommands(false);
    }
  };

  const handleSlashCommand = (command: typeof slashCommands[0]) => {
    const newContent = content.slice(0, -1) + command.action();
    setContent(newContent);
    setShowSlashCommands(false);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  const handleSave = () => {
    const noteData = { ...noteToEdit, title, content, category, status };
    onSave(noteData as Note);
    onClose();
  };

  const handleGenerateToc = () => {
    const { tocMarkdown, newContent } = generateToc(content);
    setContent(`${tocMarkdown}\n\n---\n\n${newContent}`);
  };

  const handleCorrectMarkdown = () => {
    setContent(correctMarkdown(content));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-paper-bg rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <header className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold">{noteToEdit?.id ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose}><Icon name="times" /></button>
        </header>
        <main className="p-6 space-y-4 overflow-y-auto">
          <input type="text" value={title} onChange={e => { setTitle(e.target.value); }} placeholder="Note Title" className="w-full p-2 bg-surface border rounded" />
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing... type '/' for commands"
              className="w-full p-2 bg-surface border rounded h-64"
            />
            {showSlashCommands && (
              <ul className="absolute bottom-full mb-2 w-full bg-surface border rounded shadow-lg">
                {slashCommands.map(cmd => (
                  <li key={cmd.id} onClick={() => { handleSlashCommand(cmd); }} className="p-2 hover:bg-primary hover:text-white cursor-pointer">
                    {cmd.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); }} className="w-full p-2 bg-surface border rounded">
            <option value="">Select a category</option>
            {NOTE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </main>
        <footer className="p-4 border-t border-border flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={handleGenerateToc} className="px-3 py-2 text-xs border rounded">Generate TOC</button>
            <button onClick={handleCorrectMarkdown} className="px-3 py-2 text-xs border rounded">Auto-Correct</button>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded">Save</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NoteEditorModal;
