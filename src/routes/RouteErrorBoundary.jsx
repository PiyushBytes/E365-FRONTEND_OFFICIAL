// RouteErrorBoundary: Agar kisi lazy chunk ka download fail ho jaye (e.g. network issue),
// toh pura app crash na ho — yeh graceful error screen dikhata hai with a retry button.
import React from "react";

export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Production mein yahan Sentry/DataDog ko error bheja ja sakta hai
    console.error("[RouteErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-400 text-3xl">!</span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm">This page chunk failed to load. Please check your connection.</p>
          </div>
          {/* Retry karo — browser cache clear kar ke naya chunk download hoga */}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-full text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
