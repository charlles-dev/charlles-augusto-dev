import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Details');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Algo deu errado
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="text-left mb-6">
                <details className="bg-muted/50 rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-sm mb-2">
                    Detalhes do erro
                  </summary>
                  <div className="text-xs font-mono text-destructive overflow-auto">
                    <p className="mb-2"><strong>Erro:</strong> {this.state.error.message}</p>
                    <p className="mb-2"><strong>Stack:</strong></p>
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={this.handleReset}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Recarregar página
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}