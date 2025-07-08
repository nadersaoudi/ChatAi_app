import React from "react";

const SignInPage = () => {
  return (
    <main className="min-h-screen bg-neutral-900 flex items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block">
            <div className="bg-neutral-800 rounded-2xl p-8 h-[500px] flex flex-col items-center justify-center">
              <div className="text-center space-y-6 flex flex-col items-center justify-center">
                <i className="text-6xl text-white mb-4" data-fa-i2svg>
                  <svg
                    className="svg-inline--fa fa-brain w-32 h-32"
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
                <h3 className="text-2xl text-white">AI-Powered Intelligence</h3>
                <p className="text-neutral-300 text-lg">
                  Experience the future of conversational AI with our advanced
                  chatbot technology.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-800">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-white mb-2">Welcome Back</h2>
                <p className="text-neutral-400">
                  Sign in to your AI Assistant account
                </p>
              </div>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="flex text-sm text-neutral-300 mb-2"
                  >
                    <i className="mr-2" data-fa-i2svg>
                      <svg
                        className="svg-inline--fa fa-envelope w-5 h-5"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="envelope"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        data-fa-i2svg
                      >
                        <path
                          fill="currentColor"
                          d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                        />
                      </svg>
                    </i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="flex text-sm text-neutral-300 mb-2"
                  >
                    <i className="mr-2" data-fa-i2svg>
                      <svg
                        className="svg-inline--fa fa-lock w-5 h-5"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="lock"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        data-fa-i2svg
                      >
                        <path
                          fill="currentColor"
                          d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
                        />
                      </svg>
                    </i>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded focus:ring-white focus:ring-2"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-neutral-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <span className="text-sm text-white hover:text-neutral-300 transition-colors cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <button
                  type="submit"
                  className="flex justify-center w-full bg-white text-black py-3 px-4 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all"
                >
                  <i className="mr-2" data-fa-i2svg>
                    <svg
                      className="svg-inline--fa fa-right-to-bracket w-5 h-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="right-to-bracket"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                      />
                    </svg>
                  </i>
                  Sign In
                </button>
              </form>
              <div className="mt-8 text-center">
                <p className="text-neutral-400">
                  Don&#39;t have an account?
                  <span className="text-white hover:text-neutral-300 transition-colors ml-1 cursor-pointer">
                    Create Account
                  </span>
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <div className="text-center">
                  <p className="text-xs text-neutral-500 mb-4">
                    Or continue with
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-lg transition-colors">
                      <i data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-google w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="google"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 488 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                          />
                        </svg>
                      </i>
                    </button>
                    <button className="bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-lg transition-colors">
                      <i data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-github w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="github"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 496 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                          />
                        </svg>
                      </i>
                    </button>
                    <button className="bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-lg transition-colors">
                      <i data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-microsoft w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="microsoft"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"
                          />
                        </svg>
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
