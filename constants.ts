import { ViewName, Project, Note, Task, DictionaryEntry, PlotPoint, WorldElement, PlotPointStatus, NoteStatus, OperationMode, NoteTemplate, NotePriority, LoreEntry, RelationshipType, ExportTemplate, AppTheme } from './types';

/** The default view to be displayed when the application loads. */
export const DEFAULT_VIEW: ViewName = 'dashboard';

/** The main title of the application. */
export const APP_TITLE = 'Ashval Writer\'s Suite';

/** The ID of the default AI personality to use in the AI Writer. */
export const DEFAULT_AI_PERSONALITY_ID = 'creative-writer';

/** The default status for a newly created plot point. */
export const DEFAULT_PLOT_POINT_STATUS: PlotPointStatus = 'planned';

/** The default status for a newly created note. */
export const DEFAULT_NOTE_STATUS: NoteStatus = 'draft';

/** Predefined categories for notes. */
export const NOTE_CATEGORIES = [
  { key: 'character', label: 'Characters', icon: 'user', colorClasses: { pillBg: 'bg-blue-100 dark:bg-blue-900' } },
  { key: 'world', label: 'Worldbuilding', icon: 'globe', colorClasses: { pillBg: 'bg-green-100 dark:bg-green-900' } },
  { key: 'plot', label: 'Plot', icon: 'sitemap', colorClasses: { pillBg: 'bg-red-100 dark:bg-red-900' } },
  { key: 'research', label: 'Research', icon: 'book', colorClasses: { pillBg: 'bg-yellow-100 dark:bg-yellow-900' } },
  { key: 'idea', label: 'Ideas', icon: 'lightbulb', colorClasses: { pillBg: 'bg-purple-100 dark:bg-purple-900' } },
  { key: 'other', label: 'Other', icon: 'file-alt', colorClasses: { pillBg: 'bg-gray-100 dark:bg-gray-700' } },
];

/** A list of common relationship types for character and lore management. */
export const COMMON_RELATIONSHIP_TYPES: RelationshipType[] = [
  'Ally', 'Enemy', 'Friend', 'Rival', 'Family (Sibling)', 'Family (Parent)',
  'Family (Child)', 'Family (Spouse)', 'Family (Other)', 'Mentor', 'Mentee',
  'Romantic Interest', 'Complicated', 'Neutral', 'Servant', 'Master', 'Acquaintance', 'Other'
];

/** Defines different operation modes for the AI. */
export const OPERATION_MODES: OperationMode[] = [
  // ...
];

/** Navigation items for the main sidebar menu. */
export const MAIN_NAVIGATION = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'notes', label: 'Notes', icon: 'notes' },
  { id: 'ai-writer', label: 'AI Writer', icon: 'ai' },
  { id: 'graph', label: 'Graph', icon: 'graph' }
];

/** Navigation items for the tools section of the sidebar. */
export const TOOLS_NAVIGATION = [
  { id: 'tasks', label: 'Tasks', icon: 'tasks' },
  { id: 'dictionary', label: 'Dictionary', icon: 'dictionary' },
  { id: 'lore-manager', label: 'Lore Manager', icon: 'lore' },
  { id: 'pomodoro', label: 'Pomodoro', icon: 'timer' },
  { id: 'story-structure', label: 'Story Structure', icon: 'structure' }
];

/** Navigation items for the settings section of the sidebar. */
export const SETTINGS_NAVIGATION = [
  { id: 'settings', label: 'Settings', icon: 'settings' }
];

/** Initial project data used if no data exists in local storage. */
export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Default Project',
    description: 'Your first writing project',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/** Initial note data used if no data exists in local storage. */
export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'Welcome to Ashval Writer\'s Suite',
    content: 'This is your first note. Start writing your story here!',
    category: 'idea',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    projectId: '1'
  }
];

// ... and so on for other initial data ...
