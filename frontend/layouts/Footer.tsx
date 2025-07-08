import React from "react";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-neutral-800 border-t border-neutral-700 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-neutral-600 p-2 rounded-lg">
                <i className="text-white text-xl" data-fa-i2svg>
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
              <span className="ml-3 text-white text-xl">AI Assistant</span>
            </div>
            <p className="text-neutral-400">
              Your intelligent AI companion for every conversation.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Features
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Pricing
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  API
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  About
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Blog
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                  Privacy
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center">
          <p className="text-neutral-400">
            © 2025 AI Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
