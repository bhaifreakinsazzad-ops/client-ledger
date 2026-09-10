import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { Layout } from "@/components/Layout";
import { InstallPrompt } from "@/components/InstallPrompt";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import PersonalFinance from "./pages/PersonalFinance";
import BankAccounts from "./pages/BankAccounts";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientProfile />} />
              <Route path="/finance" element={<PersonalFinance />} />
              <Route path="/accounts" element={<BankAccounts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Categories />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <InstallPrompt />
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
