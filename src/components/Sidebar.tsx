import React from 'react';
import { ViewName } from '../../types';
import Icon from './Icon';
import { APP_TITLE } from '../../constants';

interface NavItem {
  id: ViewName;
  label: string;
  icon: string;
}

interface NavConfig {
  main: NavItem[];
  tools: NavItem[];
  settings: NavItem[];
}

/**
 * @interface SidebarProps
 * @description Props for the Sidebar component.
 */
interface SidebarProps {
  isOpen: boolean;
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  navConfig: NavConfig;
}

/**
 * The application's main sidebar for navigation.
 * @param {SidebarProps} props - The props for the component.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onNavigate, navConfig }) => {
  const renderNavItem = (item: NavItem) => (
    <button
      key={item.id}
      onClick={() => onNavigate(item.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
        currentView === item.id
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-surface'
      }`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </button>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border h-16 flex items-center">
        <h2 className="text-lg font-semibold">{APP_TITLE}</h2>
      </div>
      <nav className="flex-grow p-4 space-y-6">
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase">Main</h3>
          <div className="space-y-1">{navConfig.main.map(renderNavItem)}</div>
        </div>
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase">Tools</h3>
          <div className="space-y-1">{navConfig.tools.map(renderNavItem)}</div>
        </div>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="space-y-1">{navConfig.settings.map(renderNavItem)}</div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block fixed inset-y-0 left-0 z-30 w-64 bg-paper-bg border-r border-border">
        {sidebarContent}
      </aside>

      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-paper-bg border-r border-border transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {isOpen && <div onClick={() => onNavigate(currentView)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />}
    </>
  );
};

export default Sidebar;
