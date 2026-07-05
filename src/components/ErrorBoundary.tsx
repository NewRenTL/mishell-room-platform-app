import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  reset = () => {
    this.setState({ error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6 text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-mishell-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-mishell-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-900">Algo salió mal</h1>
          <p className="text-sm text-ink-500 mt-1 max-w-xs">
            La app encontró un error inesperado. Vuelve al inicio para continuar.
          </p>
        </div>
        <button
          onClick={this.reset}
          className="flex items-center gap-2 px-5 py-3 bg-mishell-600 text-white font-semibold rounded-2xl text-sm active:scale-95 transition-transform"
        >
          <RefreshCw size={15} />
          Volver al inicio
        </button>
        <pre className="text-[10px] text-ink-400 max-w-full overflow-auto bg-ink-50 rounded-xl p-3 text-left">
          {this.state.error.message}
        </pre>
      </div>
    );
  }
}
