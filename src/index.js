import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create a root.
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  // Initial render
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
