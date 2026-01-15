import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ScoreCard from './ScoreCard';

const ChatInterface = ({
  messages,
  onSendMessage,
  isLoading,
  lastResponse,
  isDocumentUploaded,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [typingMessageId, setTypingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set typing for the latest bot message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && !typingMessageId) {
      setTypingMessageId(lastMessage.id);
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && isDocumentUploaded) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      setTypingMessageId(null);
    }
  };

  const handleTypingComplete = () => {
    setTypingMessageId(null);
  };

  return (
    <div className="relative z-10 flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto px-4">
      {/* Chat container */}
      <div className="flex-1 glass rounded-2xl neon-border overflow-hidden flex flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-orange/20 to-neon-pink/20 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-neon-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                {isDocumentUploaded
                  ? 'Start a conversation'
                  : 'Upload a document first'}
              </h3>
              <p className="text-gray-400 max-w-md">
                {isDocumentUploaded
                  ? 'Ask any question about your uploaded document. I\'ll use both semantic search and knowledge graph to find the best answer.'
                  : 'Click the "Upload Doc" button to upload a PDF, DOCX, TXT, or image file to get started.'}
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <MessageBubble
                    message={message}
                    isUser={message.isUser}
                    isTyping={message.id === typingMessageId}
                    onTypingComplete={handleTypingComplete}
                  />
                  {/* Show ScoreCard after bot responses */}
                  {!message.isUser &&
                    message.id === typingMessageId &&
                    lastResponse && (
                      <div className="ml-0 md:ml-10">
                        <ScoreCard
                          confidence={lastResponse.confidence}
                          modelUsed={lastResponse.model_used}
                        />
                      </div>
                    )}
                  {!message.isUser &&
                    message.id !== typingMessageId &&
                    index === messages.length - 1 &&
                    lastResponse && (
                      <div className="ml-0 md:ml-10">
                        <ScoreCard
                          confidence={lastResponse.confidence}
                          modelUsed={lastResponse.model_used}
                        />
                      </div>
                    )}
                </React.Fragment>
              ))}
            </>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 neon-border-pink">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-neon-pink animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-neon-orange animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-neon-yellow animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-gray-400 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-700/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isDocumentUploaded
                    ? 'Ask about your document...'
                    : 'Upload a document first to start chatting'
                }
                disabled={!isDocumentUploaded || isLoading}
                className={`
                  w-full px-5 py-4 rounded-xl
                  bg-dark-bg border border-gray-700
                  text-white placeholder-gray-500
                  transition-all duration-300
                  ${isDocumentUploaded
                    ? 'focus:border-neon-orange/50 hover:border-gray-600'
                    : 'opacity-50 cursor-not-allowed'
                  }
                `}
              />
              {/* Glow effect on focus */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-orange/0 to-neon-pink/0 opacity-0 transition-opacity duration-300 pointer-events-none focus-within:opacity-20" />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || !isDocumentUploaded || isLoading}
              className={`
                px-6 py-4 rounded-xl font-semibold
                flex items-center gap-2
                transition-all duration-300
                ${inputValue.trim() && isDocumentUploaded && !isLoading
                  ? 'bg-gradient-to-r from-neon-orange to-neon-pink text-white hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span>Send</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
