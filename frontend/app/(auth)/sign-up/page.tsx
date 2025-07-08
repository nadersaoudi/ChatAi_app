import React from "react";

const SignUpPage = () => {
  return (
    <div>
      <div
        id="registration-page"
        className="min-h-[800px] bg-neutral-900 text-white"
      >
        <main
          id="main-registration"
          className="flex items-center justify-center px-6 py-12"
        >
          <div className="w-full max-w-md">
            {/* Registration Card */}
            <div
              id="registration-card"
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-8 shadow-xl"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-neutral-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="text-white text-lg" data-fa-i2svg>
                    <svg
                      className="svg-inline--fa fa-user-plus w-5 h-5"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="user-plus"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                      />
                    </svg>
                  </i>
                </div>
                <h1 className="text-2xl text-white mb-2">Create Account</h1>
                <p className="text-neutral-400">
                  Join our AI assistant platform
                </p>
              </div>
              {/* Registration Form */}
              <form id="registration-form" className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm text-neutral-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="text-neutral-500" data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-user w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="user"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                          />
                        </svg>
                      </i>
                    </div>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-neutral-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="text-neutral-500" data-fa-i2svg>
                        <svg
                          className="svg-inline--fa fa-envelope w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="envelope"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          data-fa-i2svg
                        >
                          <path
                            fill="currentColor"
                            d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                          />
                        </svg>
                      </i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-neutral-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="text-neutral-500" data-fa-i2svg>
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
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>
                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm text-neutral-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="text-neutral-500" data-fa-i2svg>
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
                    </div>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="mt-1 h-4 w-4 text-neutral-600 bg-neutral-700 border-neutral-600 rounded focus:ring-neutral-500 focus:ring-2"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-neutral-300">
                    I agree to the{" "}
                    <span className="text-neutral-400 hover:text-neutral-300 cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-neutral-400 hover:text-neutral-300 cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>
                {/* Register Button */}
                <button
                  type="submit"
                  className="flex justify-center w-full bg-white text-black py-3 px-4 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all"
                >
                  Create Account
                </button>
              </form>
              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-neutral-400">
                  Already have an account?
                  <span className="text-neutral-400 hover:text-neutral-300 transition-colors cursor-pointer">
                    Sign in here
                  </span>
                </p>
              </div>
              {/* Social Registration */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-neutral-800 text-neutral-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-neutral-600 rounded-lg bg-neutral-700 text-sm text-neutral-300 hover:bg-neutral-600 transition-colors">
                    <i className="text-lg" data-fa-i2svg>
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
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-neutral-600 rounded-lg bg-neutral-700 text-sm text-neutral-300 hover:bg-neutral-600 transition-colors">
                    <i className="text-lg" data-fa-i2svg>
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
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer
          id="footer"
          className="border-t border-neutral-800 px-6 py-8 mt-auto"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
                <i className="text-white text-xs" data-fa-i2svg>
                  <svg
                    className="svg-inline--fa fa-robot w-3 h-3"
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
              <span className="text-lg">AI Assistant</span>
            </div>
            <p className="text-neutral-400 text-sm">
              © 2025 AI Assistant. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SignUpPage;
