import React from 'react';
import ReactDOM from 'react-dom/client';  // Note the change here
import App from './App';

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
