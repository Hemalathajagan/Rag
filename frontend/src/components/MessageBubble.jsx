import React from 'react';
import TypingEffect from './TypingEffect';

const MessageBubble = ({ message, isUser, isTyping, onTypingComplete }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}
    >
      <div
        className={`
          relative max-w-[80%] md:max-w-[70%]
          ${isUser ? 'order-2' : 'order-1'}
        `}
      >
        {/* Avatar */}
        <div
          className={`
            absolute top-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser
              ? '-right-10 bg-gradient-to-br from-neon-orange to-neon-pink'
              : '-left-10 bg-gradient-to-br from-neon-pink to-neon-purple'
            }
          `}
        >
          {isUser ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.5 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 16a1 1 0 00-1 1v1h2v-1a1 1 0 00-1-1z" />
            </svg>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`
            relative rounded-2xl px-5 py-3 glass
            ${isUser
              ? 'rounded-tr-sm bg-gradient-to-br from-neon-orange/20 to-neon-pink/20 neon-border'
              : 'rounded-tl-sm bg-dark-lighter neon-border-pink'
            }
          `}
        >
          {/* Sender label */}
          <div
            className={`
              text-xs font-semibold mb-1
              ${isUser ? 'text-neon-orange' : 'text-neon-pink'}
            `}
          >
            {isUser ? 'You' : 'AI Assistant'}
          </div>

          {/* Message content */}
          <div className="text-gray-100 leading-relaxed">
            {isTyping && !isUser ? (
              <TypingEffect
                text={message.content}
                speed={15}
                onComplete={onTypingComplete}
              />
            ) : (
              message.content
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`
              text-xs mt-2 opacity-50
              ${isUser ? 'text-right' : 'text-left'}
            `}
          >
            {formatTime(message.timestamp)}
          </div>

          {/* Glow effect for user messages */}
          {isUser && (
            <div className="absolute inset-0 rounded-2xl rounded-tr-sm bg-gradient-to-br from-neon-orange/10 to-neon-pink/10 blur-xl -z-10" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
