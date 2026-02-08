// frontend/components/Footer.tsx
// Footer component for the Todo Full-Stack Web Application
// Following ModernUIDesign skill with glassmorphism, dark mode, soft edges, and micro-interactions

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="
      bg-white/5
      backdrop-blur-xl
      border-t border-white/10
      py-8
      mt-16
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              href="/"
              className="
                flex items-center
                text-xl font-bold text-indigo-400
                hover:text-indigo-300
                transition-colors duration-200
              "
            >
              <img
                src="/logo.png"
                alt="Nexa Logo"
                className="h-6 w-6 mr-2"
                width={24}
                height={24}
              />
              <span>Nexa</span>
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Nexa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;