import React, { useState, useMemo } from 'react';
import type { DictionaryEntry } from '../../../types';
import Icon from '../Icon';

/**
 * @interface DictionaryViewProps
 * @description Props for the DictionaryView component.
 */
interface DictionaryViewProps {
  currentProjectId: string;
  dictionaryEntries: DictionaryEntry[];
  addDictionaryEntry: (newEntryData: Omit<DictionaryEntry, 'id' | 'projectId'>, projectId: string) => void;
  updateDictionaryEntry: (updatedEntry: DictionaryEntry) => void;
  deleteDictionaryEntry: (entryId: string) => void;
}

/**
 * A view for managing a project-specific dictionary.
 * @param {DictionaryViewProps} props - The props for the component.
 */
const DictionaryView: React.FC<DictionaryViewProps> = ({
  currentProjectId,
  dictionaryEntries,
  addDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);

  const projectEntries = useMemo(
    () =>
      dictionaryEntries
        .filter(entry => entry.projectId === currentProjectId)
        .filter(
          entry =>
            entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.term.localeCompare(b.term)),
    [dictionaryEntries, currentProjectId, searchTerm]
  );

  // ... form handling logic ...

  return (
    <div className="space-y-6">
      <h1>Dictionary</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setIsAdding(true)}>Add New Entry</button>
      {/* ... form and list rendering ... */}
    </div>
  );
};

export default DictionaryView;
