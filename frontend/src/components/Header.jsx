import React from 'react';

const Header = ({ onUploadClick, isDocumentUploaded, documentName }) => {
  return (
    <header className="relative z-10 py-6 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-orange via-neon-pink to-neon-yellow p-0.5 animate-pulse-glow">
              <div className="w-full h-full rounded-xl bg-dark-card flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-neon-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-orange to-neon-pink opacity-30 blur-xl -z-10" />
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-2xl font-bold gradient-text tracking-wider">
              KG RAG CHATBOT
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Knowledge Graph Powered AI Assistant
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-4">
          {/* Document Status */}
          {isDocumentUploaded && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass neon-border">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-300 truncate max-w-[150px]">
                {documentName}
              </span>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className="relative group flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-gradient-to-r from-neon-orange to-neon-pink
                       font-semibold text-white
                       transition-all duration-300 ease-out
                       hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]
                       hover:scale-105 active:scale-95
                       btn-glow"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>{isDocumentUploaded ? 'Change Doc' : 'Upload Doc'}</span>

            {/* Pulsing ring effect */}
            <span className="absolute inset-0 rounded-xl border-2 border-neon-orange opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
