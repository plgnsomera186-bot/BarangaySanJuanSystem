import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Runtime Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0084ff] text-slate-900 flex items-center justify-center p-4 font-mono">
          <div className="bg-[#cfd1d6] max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-white/50 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Barangay San Juan Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Nagkaroon ng sandaling aberya sa pag-load ng page o connection. Maaari mong i-reload ang website upang magpatuloy.
            </p>

            {this.state.error && (
              <div className="p-3 bg-red-50 text-red-800 text-[11px] rounded-xl text-left font-mono overflow-x-auto max-h-32 border border-red-200">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-6 py-2.5 bg-[#d7e635] hover:bg-[#c9d82a] text-slate-950 font-bold text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer"
              >
                I-reload ang Website
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-full border border-slate-300 transition-colors cursor-pointer"
              >
                Ibalik sa Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  sessionStorage.removeItem('sj_entry_retry');
  sessionStorage.removeItem('sj_vite_preload_retry');
} catch {}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
