"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 [ErrorBoundary] Error capturado:', error);
    console.error('🚨 [ErrorBoundary] Error Info:', errorInfo);
    console.error('🚨 [ErrorBoundary] Stack:', error.stack);
    console.error('🚨 [ErrorBoundary] Component Stack:', errorInfo.componentStack);
    
    // Log detallado del error
    console.group('🚨 Error Detallado');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Object:', error);
    console.error('Error Info:', errorInfo);
    
    // Special handling for "Invariant failed" errors
    if (error.message === 'Invariant failed' || error.message.includes('Invariant')) {
      console.error('⚠️ [ErrorBoundary] Invariant failed error detected - this usually indicates a state initialization issue');
      console.error('⚠️ [ErrorBoundary] This may be caused by:');
      console.error('  1. Component state initialized before dependencies are ready');
      console.error('  2. Race condition in async operations');
      console.error('  3. Invalid state or props passed to component');
    }
    
    console.groupEnd();

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>Error en la aplicación</h1>
          <details style={{ marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Detalles del error (click para expandir)
            </summary>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              overflow: 'auto',
              marginTop: '10px'
            }}>
              <strong>Error:</strong> {this.state.error?.name}: {this.state.error?.message}
              {'\n\n'}
              <strong>Stack:</strong>
              {'\n'}
              {this.state.error?.stack}
              {'\n\n'}
              <strong>Component Stack:</strong>
              {'\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.reload();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Recargar aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
