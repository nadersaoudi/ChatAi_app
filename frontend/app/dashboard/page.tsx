import React from "react";

const DashboardPage = () => {
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
            <button className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors">
              <i data-fa-i2svg>
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
              </i>
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
              <button className="w-full bg-neutral-600 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <i data-fa-i2svg>
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
                </i>
                <span>New Chat</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm text-neutral-400 mb-3">
                Recent Conversations
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 cursor-pointer transition-colors">
                  <div className="text-sm truncate">
                    How to learn JavaScript?
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    2 hours ago
                  </div>
                </div>
                <div className="p-3 rounded-lg hover:bg-neutral-700 cursor-pointer transition-colors">
                  <div className="text-sm truncate">Python data structures</div>
                  <div className="text-xs text-neutral-400 mt-1">Yesterday</div>
                </div>
                <div className="p-3 rounded-lg hover:bg-neutral-700 cursor-pointer transition-colors">
                  <div className="text-sm truncate">React best practices</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    2 days ago
                  </div>
                </div>
                <div className="p-3 rounded-lg hover:bg-neutral-700 cursor-pointer transition-colors">
                  <div className="text-sm truncate">API design patterns</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    3 days ago
                  </div>
                </div>
                <div className="p-3 rounded-lg hover:bg-neutral-700 cursor-pointer transition-colors">
                  <div className="text-sm truncate">Database optimization</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    1 week ago
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-700">
              <button className="w-full text-left p-2 rounded-lg hover:bg-neutral-700 transition-colors flex items-center space-x-2">
                <i data-fa-i2svg>
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
                </i>
                <span>Settings</span>
              </button>
            </div>
          </aside>
          {/* Main Chat Area */}
          <main id="main-chat" className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Welcome Message */}

              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-neutral-600 text-white p-4 rounded-2xl rounded-br-sm">
                    <p>
                      Hello! Can you help me understand machine learning basics?
                    </p>
                  </div>
                  <div className="flex items-center justify-end mt-2 space-x-2">
                    <span className="text-xs text-neutral-400">You</span>
                    <span className="text-xs text-neutral-400">2:34 PM</span>
                  </div>
                </div>
              </div>
              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-2xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="text-sm" data-fa-i2svg>
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
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-2xl rounded-bl-sm">
                      <p className="mb-3">
                        I&#39;d be happy to help you understand machine learning
                        basics! Machine learning is a subset of artificial
                        intelligence that enables computers to learn and make
                        decisions from data without being explicitly programmed.
                      </p>
                      <p>Here are the key concepts:</p>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                        <li>Supervised Learning</li>
                        <li>Unsupervised Learning</li>
                        <li>Reinforcement Learning</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 ml-11 space-x-2">
                    <span className="text-xs text-neutral-400">
                      AI Assistant
                    </span>
                    <span className="text-xs text-neutral-400">2:35 PM</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Message Input */}
            <div id="message-input" className="border-t border-neutral-700 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <textarea
                    placeholder="Type your message here..."
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    rows={1}
                    defaultValue={""}
                  />
                  <button className="absolute right-3 top-3 p-1 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition-colors">
                    <i className="text-sm" data-fa-i2svg>
                      <svg
                        className="svg-inline--fa fa-paper-plane w-5 h-5"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="paper-plane"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg
                      >
                        <path
                          fill="currentColor"
                          d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"
                        />
                      </svg>
                    </i>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                      <i data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-paperclip w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="paperclip"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
                          />
                        </svg>
                      </i>
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                      <i data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-microphone w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="microphone"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"
                          />
                        </svg>
                      </i>
                    </button>
                  </div>
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
