import React from 'react';
import Icon from '../Icon';

/**
 * @interface PlaceholderViewProps
 * @description Props for the PlaceholderView component.
 */
interface PlaceholderViewProps {
  title: string;
  iconClass: string;
  message?: string;
  children?: React.ReactNode;
}

/**
 * A generic placeholder view for features under development.
 * @param {PlaceholderViewProps} props - The props for the component.
 */
const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, iconClass, message, children }) => {
  return (
    <div className="text-center py-16">
      <Icon name={iconClass.replace(/fas fa-/g, '')} className="text-5xl mb-4" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-text-secondary">{message || 'Feature coming soon!'}</p>
      {children}
    </div>
  );
};

export default PlaceholderView;
