import React, { useState } from "react";
import { BiExpandAlt, BiCollapseAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [inputText, setInputText] = useState("dfhdfgh");
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

  return (
    <div
      className={`chat-interface ${isMinimized ? "minimized" : ""}`}
      style={{ zIndex: 2147483647 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <RiRobot2Line className="text-xl" />
          <h2 className="font-semibold text-black">AlgoChat Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            {isMinimized ? (
              <BiExpandAlt size={20} />
            ) : (
              <BiCollapseAlt size={20} />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <RiRobot2Line className="text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
                    <FaRegUser className="text-white" />
                  </div>
                )}
              </div>
            ))}
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
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
