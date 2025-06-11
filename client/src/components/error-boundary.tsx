The ErrorBoundary component is being enhanced with better error reporting and retry mechanisms.
```
```replit_final_file
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  level?: 'page' | 'component';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Report error to monitoring service
    this.reportError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // In a real app, send to error tracking service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        level: this.props.level || 'component',
        errorId: this.state.errorId,
      };

      // For development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Boundary Report');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Full Report:', errorReport);
        console.groupEnd();
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;

    if (retryCount >= 3) {
      // Reload page after 3 retries
      window.location.reload();
      return;
    }

    this.setState({ 
      hasError: false, 
      error: undefined,
      retryCount: retryCount + 1 
    });

    // Auto-retry with exponential backoff for the first attempt
    if (retryCount === 0) {
      this.retryTimeoutId = setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 1000);
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            retry={this.handleRetry}
          />
        );
      }

      const isPageLevel = this.props.level === 'page';
      const { retryCount } = this.state;

      return (
        <div className={`${isPageLevel ? 'min-h-screen flex items-center justify-center p-4' : 'm-4'}`}>
          <Card className="glass-morphism border-red-500/50 max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                {isPageLevel ? 'Page Error' : 'Component Error'}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-red-500/50 text-red-400">
                  {this.state.errorId}
                </Badge>
                {retryCount > 0 && (
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                    Retry #{retryCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                {isPageLevel 
                  ? 'This page encountered an unexpected error. Please try again or return to the home page.'
                  : 'This component encountered an error. You can try reloading or continue using other parts of the app.'
                }
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-sm text-gray-400 border border-gray-600 rounded p-2">
                  <summary className="cursor-pointer font-medium">Error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry}
                  disabled={retryCount >= 3}
                  className="flex-1"
                  variant={retryCount >= 3 ? "outline" : "default"}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {retryCount >= 3 ? 'Reload Page' : 'Try Again'}
                </Button>

                {isPageLevel && (
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                If this issue persists, please contact support with error ID: {this.state.errorId}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}