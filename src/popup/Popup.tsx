import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if API key exists on mount
    chrome.storage.local.get(['algochat_api_key'], (result) => {
      if (result.algochat_api_key) {
        setApiKey(result.algochat_api_key);
        setStatus('success');
        setMessage('API key is set');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setStatus('error');
      setMessage('Please enter an API key');
      return;
    }

    try {
      // Save API key to chrome storage
      await chrome.storage.local.set({ algochat_api_key: apiKey });
      setStatus('success');
      setMessage('API key saved successfully!');
      
      // Notify content script that API key has been updated
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            type: 'API_KEY_UPDATED',
            apiKey: apiKey 
          });
        }
      });
    } catch (error) {
      setStatus('error');
      setMessage('Failed to save API key');
    }
  };

  return (
    <div className="p-6 min-w-[300px]">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">AlgoChat Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Gemini API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your API key"
          />
        </div>

        {message && (
          <div className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save API Key
        </button>

        <div className="text-xs text-gray-500 mt-2">
          Your API key is stored securely in your browser.
        </div>
      </form>
    </div>
  );
};

export default Popup; 