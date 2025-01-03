import React, { useState } from "react";
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaRegUser, FaLightbulb } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { BsQuestionCircle, BsCodeSlash } from "react-icons/bs";

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

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "This is a mock response. Replace with actual chat functionality.",
          isUser: false,
        },
      ]);
    }, 500);

    setInputText("");
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
          <h2 className="font-semibold text-white">AlgoChat Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMinimized ? <BiExpandAlt size={20} /> : <BiCollapseAlt size={20} />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="text-center mb-4">
                  <RiRobot2Line size={40} className="mx-auto mb-3 text-blue-600" />
                  <p className="text-base font-medium text-gray-900">How can I help you today?</p>
                  <p className="text-sm text-gray-500 mt-1">Choose an option below or type your question</p>
                </div>
                <div className="w-full max-w-sm space-y-3">
                  <button
                    onClick={() => handleQuickPrompt("Can you help me solve this question?")}
                    className="w-full p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center gap-3 group"
                  >
                    <div className="text-blue-600 group-hover:text-blue-700">
                      <BsQuestionCircle size={20} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Help me solve this question</p>
                      <p className="text-sm text-gray-500 mt-0.5">Get step-by-step guidance</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt("What concepts do I need to know for this problem?")}
                    className="w-full p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center gap-3 group"
                  >
                    <div className="text-blue-600 group-hover:text-blue-700">
                      <FaLightbulb size={20} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">What concepts should I know?</p>
                      <p className="text-sm text-gray-500 mt-0.5">Learn key concepts needed</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickPrompt("Can you give me a hint for this problem?")}
                    className="w-full p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center gap-3 group"
                  >
                    <div className="text-blue-600 group-hover:text-blue-700">
                      <BsCodeSlash size={20} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Give me a hint</p>
                      <p className="text-sm text-gray-500 mt-0.5">Get a helpful hint</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <RiRobot2Line className="text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.isUser
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">{message.text}</p>
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-3">
                        <FaRegUser className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-gray-200"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-w-[80px] flex items-center justify-center font-medium"
                style={{ backgroundColor: "#2563eb" }}
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
