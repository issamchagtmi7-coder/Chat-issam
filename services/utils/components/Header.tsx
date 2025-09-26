import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const LogoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        {/* Top and bottom bars creating a frame-like 'I' with transparency */}
        <path d="M4 4h16v3H4V4zm0 13h16v3H4v-3z" fillOpacity="0.8" />
        {/* Vertical stem with transparency */}
        <path d="M10 8h4v8h-4V8z" fillOpacity="0.8" />
        {/* Central circle for the AI/lens focus - kept solid for emphasis */}
        <circle cx="12" cy="12" r="1.5" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItemClasses = (view: View) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
      currentView === view
        ? 'bg-cyan-500 text-white shadow-md'
        : 'text-slate-300 hover:bg-slate-700'
    }`;

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 shadow-lg flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <LogoIcon />
        <h1 className="text-xl font-bold text-white tracking-wide">
          Chat Issam
        </h1>
      </div>
      <nav className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setCurrentView(View.CHAT)}
          className={navItemClasses(View.CHAT)}
        >
          Chat
        </button>
        <button
          onClick={() => setCurrentView(View.PHOTO_EDITOR)}
          className={navItemClasses(View.PHOTO_EDITOR)}
        >
          Éditeur Photo
        </button>
      </nav>
    </header>
  );
};

export default Header;
