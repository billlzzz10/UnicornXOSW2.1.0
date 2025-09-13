import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export interface Command {
  id: string;
  name: string;
  action: () => void;
  icon?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setActiveIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          handleCommandClick(filteredCommands[activeIndex]);
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, filteredCommands]);

  const handleCommandClick = (command: Command) => {
    command.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-[20vh]" onClick={onClose}>
      <div className="bg-paper-bg rounded-lg shadow-xl w-full max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-2 flex items-center border-b border-border">
          <Icon name="search" className="w-5 h-5 mx-2 text-text-disabled" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-transparent focus:outline-none"
          />
        </div>
        <ul className="p-2 max-h-80 overflow-y-auto">
          {filteredCommands.length > 0 ? filteredCommands.map((command, index) => (
            <li key={command.id}>
              <button
                onClick={() => handleCommandClick(command)}
                className={`w-full text-left p-2 rounded-md flex items-center gap-2 ${index === activeIndex ? 'bg-primary text-white' : 'hover:bg-surface'}`}
              >
                {command.icon && <Icon name={command.icon} className="w-4 h-4" />}
                <span>{command.name}</span>
              </button>
            </li>
          )) : (
            <li className="p-4 text-center text-text-secondary">No commands found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;
