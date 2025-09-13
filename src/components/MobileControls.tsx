import React, { useState } from 'react';
import Icon from './Icon';

/**
 * @interface MobileControlsProps
 * @description Props for the MobileControls component.
 */
interface MobileControlsProps {
  onQuickAction: (action: string) => void;
}

/**
 * A floating action button for mobile screens.
 * @param {MobileControlsProps} props - The props for the component.
 */
const MobileControls: React.FC<MobileControlsProps> = ({ onQuickAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string) => {
    onQuickAction(action);
    setIsOpen(false);
  };

  const actions = [
    { id: 'notes', icon: 'file-plus', label: 'New Note' },
    { id: 'tasks', icon: 'check-square', label: 'New Task' },
  ];

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-40">
      {isOpen && (
        <div className="flex flex-col items-center gap-3 mb-3">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="w-14 h-14 rounded-full bg-surface shadow-lg flex items-center justify-center"
            >
              <Icon name={action.icon} />
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-16 h-16 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
      >
        <Icon name={isOpen ? 'times' : 'plus'} />
      </button>
    </div>
  );
};

export default MobileControls;
