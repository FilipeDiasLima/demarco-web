import Layout from "@/components/layout";
import PrivateRoute from "@/components/private-route";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Colaborators from "@/pages/colaborators";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import MedicalCertificate from "@/pages/medical-certificate";
import NewMedicalCertificate from "@/pages/new-medical-certificate";
import NotFound from "@/pages/not-found";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/colaborators"
              element={
                <PrivateRoute>
                  <Layout>
                    <Colaborators />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/medical-certificate"
              element={
                <PrivateRoute>
                  <Layout>
                    <MedicalCertificate />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/medical-certificate/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <NewMedicalCertificate />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
