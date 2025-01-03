import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatInterface from './components/ChatInterface';
import './styles/content_script.css';

const init = () => {
  console.log('AlgoChat init started');
  
  // Development auto-reload
  if (process.env.NODE_ENV === 'development') {
    const reloadInterval = setInterval(() => {
      chrome.runtime.sendMessage({ type: 'RELOAD_EXTENSION' }, (response) => {
        if (chrome.runtime.lastError) {
          clearInterval(reloadInterval);
        }
      });
    }, 1000);
  }

  // Remove any existing container
  const existingContainer = document.getElementById('algo-chat-container');
  if (existingContainer) {
    existingContainer.remove();
  }

  // Create container for chat interface
  const container = document.createElement('div');
  container.id = 'algo-chat-container';
  container.style.zIndex = '2147483647';
  document.body.appendChild(container);

  console.log('Container created:', container);

  try {
    // Render chat interface
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatInterface />
      </React.StrictMode>
    );
    console.log('Chat interface rendered successfully');
  } catch (error) {
    console.error('Error rendering chat interface:', error);
  }
};

// Ensure the script runs after the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-run initialization when navigating between pages (for SPAs)
window.addEventListener('popstate', init); 