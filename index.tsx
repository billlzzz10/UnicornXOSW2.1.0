import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Main entry point for the React application.
 * It renders the App component into the root DOM element.
 */
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
