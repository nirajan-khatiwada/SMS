import React, { useState, useEffect } from "react";
import Logo from "./../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { Contact,BadgeDollarSign,Rocket   } from 'lucide-react';

const navbar = [
  {
    type: "logo",
    url: Logo,
    alt: "Logo",
    path: "/",
  },
  {
    name: "Contact Us",
    path: "/contact",
    icon: <Contact/>, // Phone icon
  },
  {
    name: "Pricing",
    path: "/pricing",
    icon: <BadgeDollarSign />, // Diamond icon
  },
  {
    name: "Get Started",
    path: "/login",
    icon: <Rocket/>, // Rocket icon
    isButton: true,
  },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out shadow-xl ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-2xl shadow-gray-100/50 border-b border-gray-100/50"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              {navbar.map((element, index) => {
                if (element.type === "logo") {
                  return (                    <NavLink
                      key={index}
                      to={element.path}
                      className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105 focus:outline-none rounded-lg p-1"
                    >
                      <div className="relative">
                        <img
                          src={element.url}
                          alt={element.alt}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                      </div>
                     
                    </NavLink>
                  );
                }
                return null;
              })}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navbar.map((element, index) => {
                if (element.type !== "logo") {
                  return (                    <NavLink
                      key={index}
                      to={element.path}
                      className={({ isActive }) =>
                        `group relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none ${
                          element.isButton
                            ? isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700"
                            : isActive
                            ? "text-blue-600 bg-blue-50/80 shadow-sm"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50/80"
                        }`
                      }
                    >
                      <span className="text-base">{element.icon}</span>
                      <span className="font-semibold">{element.name}</span>
                      {!element.isButton && (
                        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></div>
                      )}
                    </NavLink>
                  );
                }
                return null;
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">              <button
                onClick={toggleMobileMenu}
                className="relative p-2 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-300 focus:outline-none group"
                aria-label="Toggle navigation menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 transform group-hover:bg-blue-600 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                    }`}
                  ></span>
                  <span
                    className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 group-hover:bg-blue-600 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 transform group-hover:bg-blue-600 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden`}
        >
          <div className="mx-4 mb-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
            <div className="py-2">
              {navbar.map((element, index) => {
                if (element.type !== "logo") {
                  return (
                    <NavLink
                      key={index}
                      to={element.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center space-x-3 px-6 py-4 text-base font-medium transition-all duration-300 hover:bg-gray-50/80 ${
                          element.isButton
                            ? isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-3 my-2 rounded-xl shadow-lg"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-3 my-2 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700"
                            : isActive
                            ? "text-blue-600 bg-blue-50/80 border-r-4 border-blue-600"
                            : "text-gray-700 hover:text-blue-600"
                        }`
                      }
                    >
                      <span className="text-lg">{element.icon}</span>
                      <span className="font-semibold">{element.name}</span>
                      <div className="ml-auto">
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            element.isButton ? "text-white/70" : "text-gray-400 group-hover:text-blue-600"
                          } group-hover:translate-x-1`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </NavLink>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
