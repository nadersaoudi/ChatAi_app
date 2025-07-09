"use client";

import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div>
        <Header />
        <main id="hero-section" className="bg-neutral-900 h-[600px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl text-white mb-6">
                  Your AI Assistant for
                  <span className="text-neutral-400">Everything</span>
                </h1>
                <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
                  Experience the power of advanced AI conversation. Get instant
                  answers, creative ideas, and intelligent assistance for any
                  task.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <SignedIn>
                    <button
                      className="bg-neutral-600 hover:bg-neutral-700 text-white px-8 py-4 rounded-lg text-lg transition-colors flex items-center justify-center"
                      onClick={() => router.push("/dashboard")}
                    >
                      <i className="mr-2" data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-play w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="play"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                          />
                        </svg>
                      </i>
                      Try the AI
                    </button>
                  </SignedIn>
                  <SignedOut>
                    <button
                      className="bg-neutral-600 hover:bg-neutral-700 text-white px-8 py-4 rounded-lg text-lg transition-colors flex items-center justify-center"
                      onClick={() => router.push("/sign-in")}
                    >
                      <i className="mr-2" data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-play w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="play"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                          />
                        </svg>
                      </i>
                      Try the AI
                    </button>
                  </SignedOut>
                  <Link href="/sign-in">
                    <button className="border border-neutral-600 hover:border-neutral-500 text-white px-8 py-4 rounded-lg text-lg transition-colors">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-md border border-neutral-700">
                  <div className="bg-neutral-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                        <i className="text-white text-sm" data-fa-i2svg>
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
                      <span className="ml-2 text-white">AI Assistant</span>
                    </div>
                    <p className="text-neutral-300 text-sm">
                      Hello! I&apos;m your AI assistant. How can I help you
                      today?
                    </p>
                  </div>
                  <div className="bg-neutral-600 rounded-lg p-4 ml-8 mb-4">
                    <p className="text-white text-sm">
                      Can you help me write a creative story?
                    </p>
                  </div>
                  <div className="bg-neutral-700 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                        <i className="text-white text-sm" data-fa-i2svg>
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
                      <span className="ml-2 text-white">AI Assistant</span>
                    </div>
                    <p className="text-neutral-300 text-sm">
                      Absolutely! I&apos;d love to help you create an engaging
                      story. What genre or theme interests you?
                    </p>
                  </div>
                  <div className="mt-4 flex items-center border border-neutral-600 rounded-lg p-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="bg-transparent text-white flex-1 outline-none placeholder-neutral-400"
                    />
                    <button className="ml-2 text-neutral-400 hover:text-neutral-300">
                      <i data-fa-i2svg>
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
                </div>
              </div>
            </div>
          </div>
        </main>
        <section id="features-section" className="bg-neutral-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl text-white mb-4">
                Powerful AI Features
              </h2>
              <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
                Discover what makes our AI assistant the perfect companion for
                your daily tasks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
                <div className="bg-neutral-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <i className="text-white text-xl" data-fa-i2svg>
                    <svg
                      className="svg-inline--fa fa-brain w-5 h-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="brain"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"
                      />
                    </svg>
                  </i>
                </div>
                <h3 className="text-white text-xl mb-3">Smart Conversations</h3>
                <p className="text-neutral-300">
                  Engage in natural, intelligent conversations with context
                  awareness and memory.
                </p>
              </div>
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
                <div className="bg-neutral-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <i className="text-white text-xl" data-fa-i2svg>
                    <svg
                      className="svg-inline--fa fa-code w-5 h-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="code"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"
                      />
                    </svg>
                  </i>
                </div>
                <h3 className="text-white text-xl mb-3">Code Assistant</h3>
                <p className="text-neutral-300">
                  Get help with programming, debugging, and code reviews across
                  multiple languages.
                </p>
              </div>
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
                <div className="bg-neutral-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <i className="text-white text-xl" data-fa-i2svg>
                    <svg
                      className="svg-inline--fa fa-lightbulb w-5 h-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="lightbulb"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"
                      />
                    </svg>
                  </i>
                </div>
                <h3 className="text-white text-xl mb-3">Creative Writing</h3>
                <p className="text-neutral-300">
                  Generate creative content, stories, and ideas with advanced
                  language models.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta-section" className="bg-neutral-900 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl text-white mb-6">
              Ready to Experience AI Excellence?
            </h2>
            <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already leveraging the power of AI
              for their daily tasks and creative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-neutral-600 hover:bg-neutral-700 text-white px-8 py-4 rounded-lg text-lg transition-colors">
                Start Chatting Now
              </button>
              <button className="border border-neutral-600 hover:border-neutral-500 text-white px-8 py-4 rounded-lg text-lg transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
