import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-base-100 text-text-primary flex items-center justify-center p-4">
            <div className="bg-base-200 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <AlertTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-text-primary">Oops! Something went wrong.</h1>
                <p className="mt-2 text-text-secondary">
                    We've encountered an unexpected issue. Please try refreshing the page.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-base-200"
                >
                    Reload Page
                </button>
            </div>
        </div>
      );
    }
    //@ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
