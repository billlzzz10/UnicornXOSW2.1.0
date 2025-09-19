import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Ashval Writer\'s Suite' }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center px-4 py-3">
        <img src="/assets/logo.jpg" alt="Logo" className="h-8 w-8 mr-3" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
