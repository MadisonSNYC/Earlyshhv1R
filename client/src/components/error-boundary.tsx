
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error tracking service (e.g., Sentry)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen electric-bg flex items-center justify-center p-4">
          <Card className="glass-morphism p-8 max-w-md w-full text-center border-0">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-300 text-sm">
                  An unexpected error occurred. Please try refreshing the page.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = '/'}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Go Home
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="text-xs text-red-400 mt-2 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
