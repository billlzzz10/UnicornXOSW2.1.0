import React, { useRef, useEffect } from 'react';
import { Project } from '../../types';
import Icon from './Icon';

/**
 * @interface ProjectSelectorDropdownProps
 * @description Props for the ProjectSelectorDropdown component.
 */
interface ProjectSelectorDropdownProps {
  isOpen: boolean;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onClose: () => void;
  onCreateNewProject: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

/**
 * A dropdown menu for selecting and creating projects.
 * @param {ProjectSelectorDropdownProps} props - The props for the component.
 */
const ProjectSelectorDropdown: React.FC<ProjectSelectorDropdownProps> = ({
  isOpen,
  projects,
  currentProjectId,
  onSelectProject,
  onClose,
  onCreateNewProject,
  triggerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-16 left-4 w-72 bg-paper-bg rounded-lg shadow-lg border border-border z-50"
    >
      <div className="p-2">
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full text-left flex items-center gap-3 px-2 py-1.5 rounded-md text-sm ${
              project.id === currentProjectId
                ? 'bg-primary text-white'
                : 'text-text-primary hover:bg-surface'
            }`}
          >
            <Icon name="book" />
            <span>{project.name}</span>
            {project.id === currentProjectId && <Icon name="check" />}
          </button>
        ))}
        <div className="border-t border-border mt-2 pt-2">
          <button
            onClick={onCreateNewProject}
            className="w-full text-left flex items-center gap-3 px-2 py-1.5 rounded-md text-sm"
          >
            <Icon name="plus" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectorDropdown;
