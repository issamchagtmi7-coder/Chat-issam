import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatView from './components/ChatView';
import PhotoEditorView from './components/PhotoEditorView';
import { View } from './types';
import { isApiKeySet } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CHAT);
  const [apiKeyOk, setApiKeyOk] = useState<boolean>(false);

  useEffect(() => {
    setApiKeyOk(isApiKeySet());
  }, []);

  const renderContent = () => {
    if (!apiKeyOk) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Clé API manquante
          </h2>
          <p className="text-slate-400">
            La variable d'environnement `process.env.API_KEY` n'est pas configurée.
            Veuillez la définir pour utiliser l'application.
          </p>
        </div>
      );
    }

    switch (currentView) {
      case View.CHAT:
        return <ChatView />;
      case View.PHOTO_EDITOR:
        return <PhotoEditorView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
