import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GovMeshProvider } from "./contexts/GovMeshContext";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import { AppLayout } from "./components/layout/AppLayout"; // Traz o Layout

// Importação das Páginas
import Index from "./pages/Index";
import Login from "./pages/Login";
import Kits from "./pages/Kits";
import Assist from "./pages/Assist";
import CRM from "./pages/CRM";
import Juridico from "./pages/Juridico";
import Boatos from "./pages/Boatos";
import Auditoria from "./pages/Auditoria";
import Configuracoes from "./pages/Configuracoes";
import Suporte from "./pages/Suporte";
import NotFound from "./pages/NotFound";
import Gamificacao from "./pages/Gamificacao";
import RadarPage from "./pages/RadarPage"; // Nova Página

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GovMeshProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPrompt />
        <BrowserRouter>
          <Routes>
            {/* Rota de Login (Solta, sem menu) */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Protegidas (Dentro do AppLayout) */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/radar" element={<RadarPage />} /> {/* Nova Rota */}
              <Route path="/kits" element={<Kits />} />
              <Route path="/assist" element={<Assist />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/juridico" element={<Juridico />} />
              <Route path="/boatos" element={<Boatos />} />
              <Route path="/auditoria" element={<Auditoria />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route path="/gamificacao" element={<Gamificacao />} />
            </Route>

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GovMeshProvider>
  </QueryClientProvider>
);

export default App;