import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import './styles/tailwind.css';

const Popup = () => {
  return (
    <div className="w-[400px] h-[600px] p-4">
      <h1 className="text-2xl font-bold">AlgoChat</h1>
      <p className="text-sm text-gray-600 mt-2">
        Chat and discuss Algochurn technical interview questions
      </p>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Popup />
    </AuthProvider>
  </React.StrictMode>
); 