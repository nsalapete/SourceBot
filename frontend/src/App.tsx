import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import AppLayout from "./components/pages/app/Layout";
import Overview from "./components/pages/app/Overview";
import Tasks from "./components/pages/app/Tasks";
import Suppliers from "./components/pages/app/Suppliers";
import Emails from "./components/pages/app/Emails";
import Agents from "./components/pages/app/Agents";
import Settings from "./components/pages/app/Settings";
import Help from "./components/pages/app/Help";
import NotFound from "./components/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
