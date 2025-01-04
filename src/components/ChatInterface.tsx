import React, { useState, useEffect, useCallback } from "react";
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { BsQuestionCircle, BsCodeSlash, BsLightbulb, BsMusicNote, BsMusicNoteBeamed } from "react-icons/bs";
import { getProblemStatement } from "../utils/scraper";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { useMusic } from '../hooks/useMusic';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define quick prompts interface
interface QuickPrompt {
  id: string;
  text: string;
  prompt: string;
  description: string;
  icon: React.ReactNode;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "solve",
    text: "Help me solve this question ",
    prompt: "Can you help me solve this question?",
    description: "Get step-by-step guidance",
    icon: <BsQuestionCircle size={20} />,
  },
  {
    id: "concepts",
    text: "What concepts should I know?",
    prompt: "What concepts do I need to know for this problem?",
    description: "Learn key concepts needed",
    icon: <BsLightbulb size={20} />,
  },
  {
    id: "hint",
    text: "Give me a hint",
    prompt: "Can you give me a hint for this problem?",
    description: "Get a helpful hint",
    icon: <BsCodeSlash size={20} />,
  },
  {
    id: "explain",
    text: "Explain me the question",
    prompt: "Can you explain this question in one sentence?",
    description: "Get a concise explanation of the question",
    icon: <BsQuestionCircle size={20} />,
  },
];

interface Message {
  text: string;
  isUser: boolean;
}

// Add this interface for code component props
interface CodeProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [problemStatement, setProblemStatement] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const { isPlaying, currentTrack, togglePlay } = useMusic();

  // Function to fetch and update problem statement
  const updateProblemStatement = useCallback(() => {
    const newProblemStatement = getProblemStatement();
    if (newProblemStatement !== problemStatement) {
      setProblemStatement(newProblemStatement);
      // Clear previous messages when problem changes
      setMessages([]);
    }
  }, [problemStatement]);

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = (message: any) => {
      if (message.type === 'URL_CHANGED') {
        // Wait a bit for the DOM to update
        setTimeout(updateProblemStatement, 1000);
      }
    };

    // Add message listener
    chrome.runtime.onMessage.addListener(handleUrlChange);

    // Initial fetch
    updateProblemStatement();

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(handleUrlChange);
    };
  }, [updateProblemStatement]);

  // Also watch for DOM changes that might indicate a route change
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' ) {
          updateProblemStatement();
          break;
        }
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => observer.disconnect();
  }, [updateProblemStatement]);

  // Initialize API key from storage
  useEffect(() => {
    chrome.storage.local.get(['algochat_api_key'], (result) => {
      if (result.algochat_api_key) {
        setApiKey(result.algochat_api_key);
      }
    });

    // Listen for API key updates from popup
    const handleMessage = (message: any) => {
      if (message.type === 'API_KEY_UPDATED') {
        setApiKey(message.apiKey);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const generateResponse = async (prompt: string) => {
    if (!apiKey) {
      setError('Please set your API key in the extension popup');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          maxOutputTokens: 1000, // Limit tokens
        },
      });

      // Construct the prompt with context
      const fullPrompt = `
        Context: ${problemStatement}
        
        User Question: ${prompt}
        
        Please provide a helpful response based on the context above.
      `;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (err) {
      setError('Failed to generate response. Please check your API key.');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputText("");

    const response = await generateResponse(userMessage);
    if (response) {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (isLoading) return;
    
    setMessages(prev => [...prev, { text: prompt, isUser: true }]);
    const response = await generateResponse(prompt);
    
    if (response) {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }
  };

  const MessageContent = ({ text, isUser }: { text: string; isUser: boolean }) => {
    if (isUser) {
      return <p className="text-[15px] leading-relaxed text-white">{text}</p>;
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="markdown-content text-[15px] leading-relaxed prose prose-sm max-w-none 
          prose-headings:text-gray-800 
          prose-p:text-gray-800 
          prose-strong:text-gray-800 
          prose-pre:bg-gray-100 
          prose-pre:p-3 
          prose-pre:rounded-lg 
          prose-code:text-blue-700 
          prose-code:bg-blue-50 
          prose-code:px-1.5 
          prose-code:py-0.5 
          prose-code:rounded 
          prose-code:text-sm
          prose-code:before:content-none 
          prose-code:after:content-none
          prose-ul:text-gray-800
          prose-ol:text-gray-800
          prose-li:text-gray-800
          [&>*:last-child]:mb-0"
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-gray-800">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-3 text-gray-800">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-gray-800">{children}</h3>,
          p: ({ children }) => <p className="mb-4 last:mb-0 text-gray-800">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-4 space-y-2 text-gray-800">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-4 space-y-2 text-gray-800">{children}</ol>,
          li: ({ children }) => <li className="mb-1 text-gray-800">{children}</li>,
          code: ({ inline, children }: CodeProps) => (
            inline ? 
              <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-medium">{children}</code> :
              <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3 text-gray-800">
                <code className="text-sm">{children}</code>
              </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={`chat-interface ${isMinimized ? "minimized" : ""}`}
      style={{ zIndex: 2147483647 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-black rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <RiRobot2Line className="text-xl  text-black" />
          <h2 className="font-semibold  text-black">AlgoChat Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`p-2 hover:bg-white/10 rounded-full transition-colors relative group ${
              isPlaying ? 'music-playing' : ''
            }`}
            title={`${isPlaying ? currentTrack?.name || 'Now Playing' : 'Play Music'}`}
          >
            {isPlaying ? (
              <BsMusicNoteBeamed 
                size={20} 
                className="text-rose-400 animate-pulse" 
              />
            ) : (
              <BsMusicNote 
                size={20} 
                className="text-white group-hover:text-rose-300 transition-colors" 
              />
            )}
            {/* Show current track tooltip */}
            {isPlaying && currentTrack && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {currentTrack.name}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            {isMinimized ? <BiExpandAlt size={20} /> : <BiCollapseAlt size={20} />}
          </button>
          {/* <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <IoClose size={20} />
          </button> */}
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-[400px] max-h-[500px]">
            {messages.length === 0 ? (
              <div className="space-y-4">
                {QUICK_PROMPTS.map((prompt) => (
                  <div
                    className="quick-prompt-button bg-white border rounded-lg cursor-pointer p-4 hover:border-blue-500 transition-all"
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600 flex-shrink-0">{prompt.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-gray-900 font-medium truncate">{prompt.text}</div>
                        <div className="text-gray-500 text-sm truncate">{prompt.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-4 ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Bot Avatar */}
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <RiRobot2Line className="text-blue-600" size={20} />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm break-words overflow-hidden ${
                        message.isUser
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 border border-gray-100"
                      }`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      <MessageContent text={message.text} isUser={message.isUser} />
                    </div>

                    {/* User Avatar */}
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-3 flex-shrink-0">
                        <FaRegUser className="text-white" size={20}/>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center justify-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                    <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl shadow-md">
                      Thinking...
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="text-red-500 text-center text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-gray-100"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 text-gray-900"
                placeholder={isLoading ? "Please wait..." : "Type a message..."}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg min-w-[80px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
