import React, { useState, useCallback } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import { Note } from '../../types';
import { INITIAL_NOTES } from '../../constants';
import NotesView from './views/NotesView';
import NoteEditorModal from './NoteEditorModal';

interface NotesState {
  notes: Note[];
  addNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>) => void;
  updateNote: (noteData: Note) => void;
  deleteNote: (noteId: string) => void;
  addMultipleNotes: (notesToAdd: Note[]) => void;
}

const useNotesStore = create<NotesState>()(
  immer((set) => ({
    notes: INITIAL_NOTES.map(n => ({
      ...n,
      wordCount: n.content.trim().split(/\s+/).filter(Boolean).length,
      characterCount: n.content.length,
    })),
    addNote: (noteData) =>
      set((state) => {
        const now = new Date();
        const newNote: Note = {
          ...noteData,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
          projectId: 'default-project',
        };
        state.notes.push(newNote);
      }),
    updateNote: (noteData) =>
      set((state) => {
        const index = state.notes.findIndex((n) => n.id === noteData.id);
        if (index !== -1) {
          state.notes[index] = { ...noteData, updatedAt: new Date() };
        }
      }),
    deleteNote: (noteId) =>
      set((state) => {
        state.notes = state.notes.filter((n) => n.id !== noteId);
      }),
    addMultipleNotes: (notesToAdd) =>
      set((state) => {
        state.notes.push(...notesToAdd);
      }),
  })),
);

const WriterSuite: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Partial<Note> | null>(null);

  const handleOpenNoteEditor = useCallback((noteData?: Partial<Note> | Note) => {
    setNoteToEdit(noteData || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setNoteToEdit(null);
  }, []);

  const handleSaveNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> | Note) => {
    if ('id' in noteData && noteData.id) {
      updateNote(noteData as Note);
    } else {
      addNote(noteData as any);
    }
    handleCloseModal();
  }, [addNote, updateNote, handleCloseModal]);

  return (
    <>
      <NotesView
        notes={notes}
        onOpenNoteEditor={handleOpenNoteEditor}
        deleteNote={deleteNote}
      />

      {isModalOpen && (
        <NoteEditorModal
          isOpen={isModalOpen}
          noteToEdit={noteToEdit}
          onClose={handleCloseModal}
          onSave={handleSaveNote}
          currentProjectId="default-project"
        />
      )}
    </>
  );
};

export default WriterSuite;