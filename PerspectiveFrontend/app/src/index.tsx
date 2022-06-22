import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './AuthContext'

const rootElem = document.getElementById('root') || document.body;
const root = ReactDOM.createRoot(rootElem);

root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
