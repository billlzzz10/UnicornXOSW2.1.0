import React, { useMemo, useState, useEffect } from 'react';
import { ViewName, Note, Task, PlotPoint, DailyQuest, DictionaryEntry } from '../../../types';
import StatRingChart from '../charts/StatRingChart';
import Icon from '../Icon';
import {
    USER_NAME,
    DASHBOARD_QUICK_ACTIONS,
    DAILY_QUESTS,
    POMODORO_SESSIONS_STORAGE_KEY,
    DASHBOARD_CHARACTER_GOAL,
    DASHBOARD_PLOT_GOAL,
    DASHBOARD_TASK_GOAL,
    NOTE_CATEGORIES
} from '../../../constants';

/**
 * @interface DashboardViewProps
 * @description Props for the DashboardView component.
 */
interface DashboardViewProps {
  onNavigate: (view: ViewName) => void;
  onQuickAction: (action: string) => void;
  notes: Note[];
  tasks: Task[];
  plotPoints: PlotPoint[];
  dictionary: DictionaryEntry[];
}

/**
 * The main dashboard view, showing a summary of the project.
 * @param {DashboardViewProps} props - The props for the component.
 */
const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onQuickAction,
  notes,
  tasks,
  plotPoints,
}) => {
    const [quests, setQuests] = useState<DailyQuest[]>(DAILY_QUESTS);

    const stats = useMemo(() => {
        const totalCharacters = notes.reduce((sum, note) => sum + (note.characterCount || 0), 0);
        const completedPlots = plotPoints.filter(p => p.status === 'completed').length;
        const completedTasks = tasks.filter(t => t.completed).length;

        return [
            { label: 'Characters', value: totalCharacters, goal: DASHBOARD_CHARACTER_GOAL, color: 'var(--c-primary)' },
            { label: 'Plots', value: completedPlots, goal: DASHBOARD_PLOT_GOAL, color: 'var(--c-secondary)' },
            { label: 'Tasks', value: completedTasks, goal: DASHBOARD_TASK_GOAL, color: 'var(--c-success)' }
        ];
    }, [notes, plotPoints, tasks]);

    const recentNotes = useMemo(() => {
        return [...notes]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3);
    }, [notes]);
    
    useEffect(() => {
        const today = new Date().toDateString();
        const savedPomodoros = localStorage.getItem(POMODORO_SESSIONS_STORAGE_KEY);
        const pomosToday = savedPomodoros && JSON.parse(savedPomodoros).date === today ? JSON.parse(savedPomodoros).count : 0;
        const completedTasksToday = tasks.filter(t => t.completed && new Date(t.updatedAt).toDateString() === today).length;
        const charactersWrittenToday = notes
            .filter(n => new Date(n.updatedAt).toDateString() === today)
            .reduce((sum, n) => sum + (n.characterCount || 0), 0);

        setQuests(prevQuests => prevQuests.map(quest => {
            if (quest.id === 'quest1') return { ...quest, value: charactersWrittenToday };
            if (quest.id === 'quest2') return { ...quest, value: pomosToday };
            if (quest.id === 'quest3') return { ...quest, value: completedTasksToday };
            return quest;
        }));
    }, [notes, tasks]);


  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      <p>Welcome back, {USER_NAME}</p>
      <StatRingChart series={stats} size={240} />
      <div>
        <h2>Daily Quests</h2>
        {/* ... quests JSX ... */}
      </div>
      <div>
        <h2>Quick Actions</h2>
        {DASHBOARD_QUICK_ACTIONS.map(item => (
          <button key={item.action} onClick={() => onQuickAction(item.action)}>
            {item.title}
          </button>
        ))}
      </div>
      <div>
        <h2>Recent Notes</h2>
        <button onClick={() => onNavigate('notes')}>View All</button>
        {recentNotes.map(note => (
          <div key={note.id}>{note.title}</div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
