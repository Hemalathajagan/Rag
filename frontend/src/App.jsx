import React, { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import { uploadDocument, askQuestion } from './services/api';

function App() {
  // State management
  const [messages, setMessages] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [error, setError] = useState(null);

  // Handle file upload
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      await uploadDocument(file);
      setDocumentName(file.name);
      setIsDocumentUploaded(true);
      setIsUploadModalOpen(false);
      setMessages([]); // Clear previous messages
      setLastResponse(null);

      // Add welcome message
      setMessages([
        {
          id: Date.now(),
          content: `Great! I've processed "${file.name}". You can now ask me questions about this document. I'll use both semantic search and knowledge graph analysis to find the best answers.`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload document');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await askQuestion(content);

      const botMessage = {
        id: Date.now() + 1,
        content: response.answer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setLastResponse(response);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        content: err.response?.data?.error || 'Sorry, I encountered an error while processing your question. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLastResponse({ confidence: 'Low', model_used: 'N/A' });
      console.error('Ask error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Animated particle background */}
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <Header
          onUploadClick={() => setIsUploadModalOpen(true)}
          isDocumentUploaded={isDocumentUploaded}
          documentName={documentName}
        />

        {/* Error notification */}
        {error && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="glass rounded-xl px-6 py-3 border border-red-500/50 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat interface */}
        <div className="flex-1 py-4">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            lastResponse={lastResponse}
            isDocumentUploaded={isDocumentUploaded}
          />
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-4 text-center text-gray-500 text-sm">
          <p>
            Powered by{' '}
            <span className="text-neon-orange">Knowledge Graph</span> +{' '}
            <span className="text-neon-pink">RAG</span> +{' '}
            <span className="text-neon-purple">GPT-4</span>
          </p>
        </footer>
      </div>

      {/* Upload modal */}
      {isUploadModalOpen && (
        <FileUpload
          onFileSelect={handleFileUpload}
          onClose={() => setIsUploadModalOpen(false)}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}

export default App;
