import { Component, ErrorInfo, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import AppLayout from "@/pages/app/Layout";
import Overview from "@/pages/app/Overview";
import Tasks from "@/pages/app/Tasks";
import Suppliers from "@/pages/app/Suppliers";
import Emails from "@/pages/app/Emails";
import Agents from "@/pages/app/Agents";
import Account from "@/pages/app/Account";
import Settings from "@/pages/app/Settings";
import Help from "@/pages/app/Help";
import NotFound from "@/pages/NotFound";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "system-ui" }}>
          <h1>Something went wrong</h1>
          <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Overview />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="emails" element={<Emails />} />
              <Route path="agents" element={<Agents />} />
              <Route path="/app/account" element={<Account />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
