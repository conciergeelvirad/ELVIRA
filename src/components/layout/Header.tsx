import { Menu } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.NAME}</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>

          <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
