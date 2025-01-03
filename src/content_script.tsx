import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatInterface from './components/ChatInterface';
import './styles/content_script.css';

const init = () => {
  console.log('AlgoChat init started');

  try {
    // Safely remove existing container if it exists
    const existingContainer = document.getElementById('algo-chat-container');
    if (existingContainer && existingContainer.parentNode) {
      existingContainer.parentNode.removeChild(existingContainer);
    }

    // Create new container
    const container = document.createElement('div');
    container.id = 'algo-chat-container';
    document.body.appendChild(container);

    // Create root and render
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatInterface />
      </React.StrictMode>
    );
    
    console.log('Chat interface rendered successfully');
  } catch (error) {
    console.error('Error initializing chat interface:', error);
  }
};

// Initialize only after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
}); 