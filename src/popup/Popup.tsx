import React, { useState, useEffect } from 'react';
import { RiRobot2Line } from "react-icons/ri";
import './Popup.css';

const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
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
      await chrome.storage.local.set({ algochat_api_key: apiKey });
      setStatus('success');
      setMessage('API key saved successfully!');
      
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
    <div className="min-h-[250px] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center gap-2">
          <RiRobot2Line className="text-2xl text-white" />
          <h1 className="text-xl font-semibold text-white">AlgoChat Assistant</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                placeholder:text-gray-400"
                placeholder="Enter your API key"
              />
              <p className="mt-1 text-xs text-gray-500">
                Get your API key from Google AI Studio
              </p>
            </div>

            {message && (
              <div 
                className={`text-sm p-2 rounded ${
                  status === 'error' 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 transition-colors disabled:opacity-50
              disabled:cursor-not-allowed"
              disabled={status === 'success'}
            >
              {status === 'success' ? 'API Key Saved' : 'Save API Key'}
            </button>

            <div className="text-xs text-gray-500">
              Your API key is stored securely in your browser.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup; 