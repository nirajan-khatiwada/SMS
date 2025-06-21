import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import {
  Home,
  BadgeDollarSign,
  Rocket,
  Contact,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const footerData = {
  logo: {
    url: Logo,
    alt: "Logo",
  },
  quickLinks: [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Pricing", path: "/pricing", icon: <BadgeDollarSign size={16} /> },
    { name: "Get Started", path: "/login", icon: <Rocket size={16} /> },
    { name: "Contact Us", path: "/contact", icon: <Contact size={16} /> },
  ],
  contact: {
    email: "nirajankhatiwada29",
    phone: "+977 9866388755",
    address: "Hetauda, Nepal",
  },
  social: [
    {
      name: "Github",
      icon: <Github size={20} />,
      url: "https://github.com/nirajan-khatiwada/",
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: "https://twitter.com/__nirajan__",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: "https://www.linkedin.com/in/nirajan-khatiwada/",
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      url: "https://www.instagram.com/nirajankhatiwada.17",
    },
  ],
  copyright: {
    companyName: "Nk Group",
    year: new Date().getFullYear(),
  },
};

const Footer = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-100/50 shadow-2xl shadow-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <NavLink
                to="/"
                className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
              >
                <div className="relative">
                  <img
                    src={footerData.logo.url}
                    alt={footerData.logo.alt}
                    className="w-10 h-10 object-contain transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
              </NavLink>
              <p className="text-gray-600 text-sm text-center lg:text-left leading-relaxed">
                Building amazing experiences with modern technology and
                innovative solutions.
              </p>
            </div>
          </div>

          <div className="col-span-2 flex justify-around">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center lg:text-left">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {footerData.quickLinks.map((link, index) => (
                  <li
                    key={index}
                    className="flex justify-start lg:justify-start"
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `group flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          isActive
                            ? "text-blue-600 bg-blue-50/80 shadow-sm"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50/80"
                        }`
                      }
                    >
                      <span className="text-sm">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center lg:text-left">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-end lg:justify-start space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <Mail size={16} className="flex-shrink-0" />
                  <a
                    href={`mailto:${footerData.contact.email}`}
                    className="text-sm hover:underline break-all"
                  >
                    {footerData.contact.email}
                  </a>
                </div>
                <div className="flex items-center justify-end lg:justify-start space-x-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <Phone size={16} className="flex-shrink-0" />
                  <a
                    href={`tel:${footerData.contact.phone}`}
                    className="text-sm hover:underline"
                  >
                    {footerData.contact.phone}
                  </a>
                </div>
                <div className="flex items-center justify-end lg:justify-start space-x-3 text-gray-600">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span className="text-sm">{footerData.contact.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center lg:text-left">
              Follow Us
            </h3>
            <div className="flex justify-center lg:justify-start space-x-4">
              {footerData.social.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="group p-3 rounded-xl bg-gray-50/80 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500">
              &copy; {footerData.copyright.year}{" "}
              <span className="font-semibold text-gray-700">
                {footerData.copyright.companyName}
              </span>
              . All rights reserved.
            </p>
          </div>

          {/* Additional Links */}
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 cursor-default">
              Made with ❤️ by{" "}
              <span className="font-semibold text-gray-700 hover:text-blue-600">
                NK Group
              </span>
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      </div>
    </footer>
  );
};

export default Footer;
