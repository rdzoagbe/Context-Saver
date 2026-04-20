import * as React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

// @ts-ignore
export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    // @ts-ignore
    this.setState({
      errorInfo: error.message
    });
  }

  public handleReset = () => {
    // @ts-ignore
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    // @ts-ignore
    if (this.state.hasError) {
      // @ts-ignore
      const isFirestoreError = this.state.errorInfo?.includes('operationType') || this.state.error?.message.includes('operationType');
      // @ts-ignore
      const isConfigError = (window as any).__FIREBASE_CONFIG_ERROR__ === "Invalid API Key" || this.state.error?.message.toLowerCase().includes('api key not valid');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isConfigError ? 'Configuration Error' : (isFirestoreError ? 'Database Connection Error' : 'Something went wrong')}
            </h1>
            
            <p className="text-slate-600 mb-8">
              {isConfigError 
                ? 'Your Firebase API Key is being rejected. This usually happens if the domain "mindmark.tech" has not been added to your Firebase Authorized Domains.'
                : (isFirestoreError 
                ? 'We encountered an issue communicating with our servers. Please check your connection and try again.'
                : 'An unexpected error occurred. Our team has been notified and we are working to fix it.')}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {isConfigError ? (
                <Button 
                  onClick={() => window.location.href = '#/login'}
                  className="col-span-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Login to Fix Key
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={this.handleReload}
                    className="flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </Button>
                  <Button 
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
