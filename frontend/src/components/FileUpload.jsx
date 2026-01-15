import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect, onClose, isUploading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/tiff',
    'image/bmp',
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (acceptedTypes.includes(file.type) || file.name.endsWith('.txt')) {
      setSelectedFile(file);
    } else {
      alert('Please upload a PDF, DOCX, TXT, or image file.');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    const ext = selectedFile.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      return (
        <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13H10v4.5H8.5v-1.5H7v1.5H5.5V13H7v1.5h1.5V13zm3 0h3v1h-1.5v.5H14v1h-1v.5h1.5v1h-3V13zm4 0H17v1.5h.5V13h1.5v4.5h-1.5V16H17v1.5h-1.5V13z"/>
        </svg>
      );
    }
    if (ext === 'docx' || ext === 'doc') {
      return (
        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM7 13h2l1 4 1-4h2l-2 6H9l-2-6zm7 0h4v1.5h-2.5v1h2v1h-2v1h2.5V19h-4v-6z"/>
        </svg>
      );
    }
    if (['png', 'jpg', 'jpeg', 'tiff', 'bmp'].includes(ext)) {
      return (
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl neon-border animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-display font-bold gradient-text mb-2">
            Upload Document
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Drag and drop your file or click to browse
          </p>

          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-300 ease-out
              ${isDragActive
                ? 'border-neon-orange bg-neon-orange/10 shadow-[0_0_30px_rgba(255,107,53,0.3)]'
                : 'border-gray-600 hover:border-neon-orange/50 hover:bg-white/5'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.tiff,.bmp"
              onChange={handleInputChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                {getFileIcon()}
                <div>
                  <p className="font-semibold text-white">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-sm text-neon-pink hover:text-neon-orange transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-orange/20 to-neon-pink/20 flex items-center justify-center">
                  <svg
                    className={`w-8 h-8 transition-colors ${isDragActive ? 'text-neon-orange' : 'text-gray-400'}`}
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
                </div>
                <p className="text-gray-300 mb-2">
                  Drop your file here, or{' '}
                  <span className="text-neon-orange">browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, TXT, PNG, JPG supported
                </p>
              </>
            )}
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`
              w-full mt-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${selectedFile && !isUploading
                ? 'bg-gradient-to-r from-neon-orange to-neon-pink text-white hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] hover:scale-[1.02]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Upload & Process'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
