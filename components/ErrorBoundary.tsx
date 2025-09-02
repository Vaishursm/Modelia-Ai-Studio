import * as React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-base-100 text-text-primary flex flex-col justify-center items-center p-4">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
            <p className="text-text-secondary mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-800 transition"
            >
                Refresh Page
            </button>
        </div>
      );
    }
    //@ts-ignore
    return this.props.children;
  }
}
