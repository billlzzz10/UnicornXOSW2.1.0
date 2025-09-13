import React from 'react';
import { Project } from '../../types';
import Icon from './Icon';

/**
 * @interface HeaderProps
 * @description Props for the Header component.
 */
interface HeaderProps {
  onSidebarToggle: () => void;
  currentProject?: Project;
  onProjectSelectorToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onThemeToggle: () => void;
  onQuickAction: (action: string) => void;
  isDarkMode: boolean;
}

/**
 * The main application header.
 * @param {HeaderProps} props - The props for the component.
 */
const Header: React.FC<HeaderProps> = ({
  onSidebarToggle,
  currentProject,
  onProjectSelectorToggle,
  onThemeToggle,
  onQuickAction,
  isDarkMode,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-paper-bg/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button onClick={onSidebarToggle} className="p-2 rounded-md hover:bg-surface md:hidden">
          <Icon name="menu" />
        </button>
        <button onClick={onProjectSelectorToggle} className="flex items-center gap-2 p-2 rounded-md hover:bg-surface">
          <Icon name="book" />
          <span>{currentProject?.name || 'Select Project'}</span>
          <Icon name="chevron-down" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onQuickAction('notes')} className="p-2 rounded-md hover:bg-surface">
          <Icon name="plus-circle" />
        </button>
        <button onClick={onThemeToggle} className="p-2 rounded-md hover:bg-surface">
          <Icon name={isDarkMode ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  );
};

export default Header;
