
import React, { useState, useEffect } from 'react';

interface ToasterProps {
  children: React.ReactNode;
}

export const Toaster: React.FC<ToasterProps> = ({ children }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {children}
      </div>
    </div>
  );
};

interface ToastProps {
  message: string;
  type: 'error' | 'info';
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      // Allow time for fade out animation before calling onDismiss
      setTimeout(onDismiss, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseClasses = "max-w-sm w-full bg-base-200 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-500";
  const typeClasses = type === 'error' ? 'text-red-400' : 'text-blue-400';
  const showClasses = show ? "transform ease-out opacity-100 translate-y-0 sm:translate-x-0" : "transform ease-in opacity-0 translate-y-2 sm:translate-y-0 sm:translate-x-2";

  return (
    <div className={`${baseClasses} ${showClasses}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${typeClasses}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => {
                setShow(false);
                setTimeout(onDismiss, 500);
              }}
              className="bg-base-200 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-base-200"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
