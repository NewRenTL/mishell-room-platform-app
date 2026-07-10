import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

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
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.name === 'ChunkLoadError'
    ) {
      window.location.reload();
      return;
    }
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  reset = () => {
    this.setState({ error: null });
    window.location.href = '/';
  };

  logout = () => {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  };

  render() {
    if (!this.state.error) return this.props.children;

    const isChunkError =
      this.state.error.message.includes('Failed to fetch dynamically imported module') ||
      this.state.error.name === 'ChunkLoadError';

    if (isChunkError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-white px-6 text-center gap-5">
          <div className="w-8 h-8 border-2 border-mishell-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-500">Actualizando la app…</p>
        </div>
      );
    }

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
        <button
          onClick={this.logout}
          className="flex items-center gap-2 px-5 py-2.5 border border-ink-200 text-ink-600 font-medium rounded-2xl text-sm active:scale-95 transition-transform"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
        <pre className="text-[10px] text-ink-400 max-w-full overflow-auto bg-ink-50 rounded-xl p-3 text-left">
          {this.state.error.message}
        </pre>
      </div>
    );
  }
}
