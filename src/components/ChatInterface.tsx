import React, { useState } from "react";
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { BsQuestionCircle, BsCodeSlash, BsLightbulb } from "react-icons/bs";

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
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([...messages, { text: inputText, isUser: true }]);
    setInputText("");

    // Mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "This is a mock response. Replace with actual chat functionality.",
          isUser: false,
        },
      ]);
    }, 500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessages([...messages, { text: prompt, isUser: true }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "This is a mock response. Replace with actual chat functionality.",
          isUser: false,
        },
      ]);
    }, 500);
  };

  return (
    <div
      className={`chat-interface ${isMinimized ? "minimized" : ""}`}
      style={{ zIndex: 2147483647 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <RiRobot2Line className="text-xl" />
          <h2 className="font-semibold text-black">AlgoChat Assistant </h2>
        </div>
        <div
          className="flex flex-direction-row  items-center gap-x-2 gap-y-1"
          style={{ flexDirection: "row", columnGap: "10px", rowGap: "10px" }}
        >
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMinimized ? (
              <BiExpandAlt size={20} />
            ) : (
              <BiCollapseAlt size={20} />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-[400px] max-h-[500px]">
            {messages.length === 0 ? (
              <div className="space-y-4">
                {QUICK_PROMPTS.map((prompt) => (
                  <div
                    className="quick-prompt-button bg-gray-100 border rounded-md cursor-pointer px-2 py-1"
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                  >
                    <div className="quick-prompt-text text-black text-sm">
                      {prompt.prompt}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-center mb-4 ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Bot Avatar */}
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <RiRobot2Line className="text-blue-600" size={20} />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md ${
                        message.isUser
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">
                        {message.text}
                      </p>
                    </div>

                    {/* User Avatar */}
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-3">
                        <FaRegUser className="text-white" size={20}/>
                      </div>
                    )}
                  </div>
                ))}
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
                className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg min-w-[80px] font-medium"
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
