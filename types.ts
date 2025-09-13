/**
 * Represents the main data entities and type definitions for the application.
 */

/** Defines the set of possible views (pages) in the application. */
export type ViewName =
  | 'dashboard'
  | 'graph'
  | 'notes'
  | 'ai-writer'
  | 'settings'
  | 'tasks'
  | 'dictionary'
  | 'lore-manager'
  | 'pomodoro'
  | 'story-structure'
  | 'forecast'
  | 'universe-map';

/** Represents a single writing project. */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Represents a single note. */
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  status: NoteStatus;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
  characterCount?: number;
}

/** Represents a to-do item. */
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  projectId?: string;
}

/** Represents a dictionary entry. */
export interface DictionaryEntry {
  id: string;
  term: string;
  definition: string;
  category: string;
  projectId?: string;
}

/** Represents a plot point. */
export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  status: PlotPointStatus;
  order: number;
  projectId?: string;
}

/** Represents a world-building element. */
export interface WorldElement {
  id: string;
  name: string;
  type: string;
  description: string;
  projectId?: string;
}

/** Represents a link between two nodes in the graph. */
export interface GraphLink {
  id: string;
  from: string;
  to: string;
  relationship: LinkRelationshipType;
  description?: string;
  targetId: string;
  type: string;
}

/** Defines the possible statuses for a plot point. */
export type PlotPointStatus = 'planned' | 'in-progress' | 'completed';
/** Defines the types of relationships for graph links. */
export type LinkRelationshipType = 'related' | 'causes' | 'affects' | 'contains' | 'references';
/** Defines the possible statuses for a note. */
export type NoteStatus = 'draft' | 'review' | 'published' | 'archived';

/** Represents an AI personality. */
export interface AiPersonality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

/** Represents the payload for the forecast agent. */
export interface ForecastPayload {
  userId: string;
  forecastType: 'project_timeline' | 'resource_allocation' | 'task_completion';
  timeRange: { start: string; end: string };
  dataSource: string;
  projectId?: string;
  modelType?: string;
  taskCategories?: string[];
  milestoneTracking?: boolean;
  graphFormat?: string;
  cacheStrategy?: 'vector' | 'none' | 'semantic';
  options?: Record<string, any>;
}

/** Represents the result from the forecast agent. */
export interface ForecastResult {
  summary: string;
  timeline: { label: string; date: string; confidence: number }[];
  risks: { description: string; probability: 'low' | 'medium' | 'high' }[];
  recommendedActions: string[];
  visualization: string;
}

export type NoteCategory = 'character' | 'place' | 'event' | 'world' | 'plot' | 'other' | '';
export type NoteDisplayFormat = 'grid' | 'list' | 'cover' | 'page';
export type PlotPointType = 'inciting_incident' | 'rising_action' | 'climax' | 'falling_action' | 'resolution' | 'other';
export type WorldElementCategory = 'character' | 'location' | 'item' | 'concept' | 'faction' | 'other';
export type DailyQuest = {
  id: string;
  title: string;
  icon: string;
  value: number;
  target: number;
  color: string;
};
export type SelectedGraphNode = (Note | PlotPoint | WorldElement) & { itemType: 'note' | 'plotPoint' | 'worldElement' };
