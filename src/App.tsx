import { AuthProvider, SettingsProvider } from "./contexts";
import { HotelDashboard } from "./pages/Hotel/HotelDashboard";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import { LoginPage, GuestLoginPage, ResetPasswordPage } from "./pages/auth";
import { GuestDashboard } from "./pages/Guests";
import { useAuth } from "./hooks/auth/useAuth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HotelStaffProvider } from "./components/common/HotelStaffProvider";
import { HotelContent } from "./components/common/HotelContent";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/guest" element={<GuestLoginPage />} />
        <Route path="/guest/dashboard" element={<GuestDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <HotelStaffProvider>
      <HotelContent>
        <SettingsProvider>
          <HotelDashboard />
        </SettingsProvider>
      </HotelContent>
    </HotelStaffProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
