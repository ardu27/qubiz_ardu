import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../features/dashboard/Dashboard";
import { Checklist } from "../features/checklist/Checklist";
import { Team } from "../features/team/Team";
import { Resources } from "../features/resources/Resources";
import { Login } from "../features/auth/Login";
import { Navbar } from "../shared/components/Navbar";
import { useCurrentUser } from "./CurrentUserContext";
import type { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#1C1917] flex flex-col md:flex-row font-sans">
      <Navbar />
      <main className="flex-1 p-8 md:p-12 lg:p-16 max-w-6xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const PublicLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useCurrentUser();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#1C1917] flex flex-col justify-center font-sans">
      {children}
    </div>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/checklist"
          element={
            <ProtectedLayout>
              <Checklist />
            </ProtectedLayout>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedLayout>
              <Team />
            </ProtectedLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedLayout>
              <Resources />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
