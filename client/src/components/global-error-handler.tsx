
import { useEffect } from 'react';
import { toast } from '../hooks/use-toast';

export function GlobalErrorHandler() {
  // Component implementation stays the same
}

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Show user-friendly error message
      toast({
        title: "Something went wrong",
        description: "Please try again or refresh the page.",
        variant: "destructive",
      });

      // Report to error tracking service
      if (window.Sentry) {
        window.Sentry.captureException(event.reason);
      }
    };

    // Handle unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      
      toast({
        title: "An error occurred",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });

      if (window.Sentry) {
        window.Sentry.captureException(event.error);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
