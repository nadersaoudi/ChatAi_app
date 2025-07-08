"use client";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  lastUpdated: number;
}

interface APIResponse {
  response: string;
}

const formatMessageWithCode = (content: string) => {
  const parts = [];
  const segments = content.split("```");

  for (let i = 0; i < segments.length; i++) {
    if (i % 2 === 1) {
      // Code block
      const languageMatch = segments[i].match(/^(\w+)\n/);
      const language = languageMatch ? languageMatch[1] : "javascript";
      const code = languageMatch
        ? segments[i].substring(languageMatch[0].length)
        : segments[i];

      parts.push(
        <div key={`code-${i}`} className="my-3 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              borderRadius: "0.5rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    } else {
      // Regular text
      if (segments[i]) {
        parts.push(
          <p key={`text-${i}`} className="whitespace-pre-line">
            {segments[i]}
          </p>
        );
      }
    }
  }

  return parts.length > 0 ? parts : content;
};

const DashboardPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm your AI assistant. Ask me anything about programming, tech, or more",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Generate a unique ID for conversations
  const generateId = (): string => Date.now().toString();

  // Get conversation title from first user message
  const getConversationTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      return firstUserMessage.content.length > 30
        ? firstUserMessage.content.substring(0, 30) + "..."
        : firstUserMessage.content;
    }
    return "New Chat";
  };

  // Format timestamp for display
  const formatTime = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };

  // Save conversation to history
  const saveConversation = (
    messages: Message[],
    conversationId: string | null = null
  ): string => {
    const id = conversationId || generateId();
    const title = getConversationTitle(messages);
    const timestamp = Date.now();

    const conversationData: Conversation = {
      id,
      title,
      messages,
      timestamp,
      lastUpdated: timestamp,
    };

    setConversations((prev) => {
      const existingIndex = prev.findIndex((conv) => conv.id === id);
      if (existingIndex !== -1) {
        // Update existing conversation
        const updated = [...prev];
        updated[existingIndex] = {
          ...conversationData,
          lastUpdated: timestamp,
        };
        return updated.sort((a, b) => b.lastUpdated - a.lastUpdated);
      } else {
        // Add new conversation
        return [conversationData, ...prev].sort(
          (a, b) => b.lastUpdated - a.lastUpdated
        );
      }
    });

    return id;
  };

  // Load conversation from history
  const loadConversation = (conversationId: string): void => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
    }
  };

  // Start new conversation
  const startNewConversation = (): void => {
    const initialMessages: Message[] = [
      {
        role: "assistant",
        content:
          "I'm your AI assistant. Ask me anything about programming, tech, or more!",
      },
    ];
    setMessages(initialMessages);
    setCurrentConversationId(null);
    setInput("");
  };

  // Delete conversation
  const deleteConversation = (
    conversationId: string,
    e: React.MouseEvent
  ): void => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId)
    );
    if (currentConversationId === conversationId) {
      startNewConversation();
    }
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Replace this mock call with your actual API call:
      // Note: You'll need to import axios or use fetch
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = await response.json();
      const aiMessage: Message = { role: "assistant", content: data.response };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Save conversation after AI response
      const conversationId = saveConversation(
        finalMessages,
        currentConversationId
      );
      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
      }
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "assistant",
        content: "❌ Failed to get a response. Please try again later.",
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      // Save conversation even with error
      const conversationId = saveConversation(
        finalMessages,
        currentConversationId
      );
      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div id="dashboard" className="bg-neutral-900 text-white">
        {/* Header */}
        <header
          id="header"
          className="bg-neutral-800 border-b border-neutral-700 px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <i className="text-2xl text-neutral-400" data-fa-i2svg>
              <svg
                className="svg-inline--fa fa-robot w-5 h-5"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="robot"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                data-fa-i2svg
              >
                <path
                  fill="currentColor"
                  d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"
                />
              </svg>
            </i>
            <span className="text-xl">AI Assistant</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={startNewConversation}
              className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
            >
              <svg
                className="svg-inline--fa fa-plus w-5 h-5"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="plus"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                data-fa-i2svg
              >
                <path
                  fill="currentColor"
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                />
              </svg>
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=42"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>
        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar */}
          <aside
            id="sidebar"
            className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col"
          >
            <div className="p-4 border-b border-neutral-700">
              <button
                onClick={startNewConversation}
                className="w-full bg-neutral-600 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  className="svg-inline--fa fa-plus w-5 h-5"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="plus"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  data-fa-i2svg
                >
                  <path
                    fill="currentColor"
                    d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                  />
                </svg>
                <span>New Chat</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm text-neutral-400 mb-3">
                Discussion History
              </h3>
              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-sm text-neutral-500 text-center py-8">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => loadConversation(conversation.id)}
                      className={`group p-3 rounded-lg cursor-pointer transition-colors relative ${
                        currentConversationId === conversation.id
                          ? "bg-neutral-700"
                          : "hover:bg-neutral-700"
                      }`}
                    >
                      <div className="text-sm truncate pr-6">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {formatTime(conversation.timestamp)}
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conversation.id, e)}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-600 transition-all"
                      >
                        <svg
                          className="w-3 h-3 text-neutral-400 hover:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-4 border-t border-neutral-700">
              <button className="w-full text-left p-2 rounded-lg hover:bg-neutral-700 transition-colors flex items-center space-x-2">
                <svg
                  className="svg-inline--fa fa-gear w-5 h-5"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="gear"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg
                >
                  <path
                    fill="currentColor"
                    d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
                  />
                </svg>
                <span>Settings</span>
              </button>
            </div>
          </aside>
          {/* Main Chat Area */}
          <main id="main-chat" className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 mr-3 self-end mb-4">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=AI&scale=80&backgroundColor=65c9ff"
                        alt="AI Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`${
                      msg.role === "user" ? "bg-neutral-600" : "bg-neutral-800"
                    } p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "rounded-br-sm max-w-md"
                        : "rounded-bl-sm max-w-2xl"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="text-sm">
                        {formatMessageWithCode(msg.content)}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-line">
                        {msg.content}
                      </p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 ml-3 self-end mb-4">
                      <img
                        src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=42"
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start items-center">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=AI&scale=80&backgroundColor=65c9ff"
                      alt="AI Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="ml-11 text-sm text-neutral-400 animate-pulse">
                    AI is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Message input */}
            <div id="message-input" className="border-t border-neutral-700 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <textarea
                    placeholder="Type your message here..."
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={handleSend}
                    className="absolute right-3 top-3 p-1 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <svg
                      className="svg-inline--fa fa-paper-plane w-5 h-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="paper-plane"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-neutral-400">
                    Press Enter to send
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
