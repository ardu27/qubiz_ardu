import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Employee } from "../shared/types";

interface CurrentUserContextType {
  token: string | null;
  currentUser: Employee | null;
  currentEmployeeId: number;
  login: (token: string, employee: Employee) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("meridian_token"));
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const stored = localStorage.getItem("meridian_user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken: string, employee: Employee) => {
    localStorage.setItem("meridian_token", newToken);
    localStorage.setItem("meridian_user", JSON.stringify(employee));
    setToken(newToken);
    setCurrentUser(employee);
  };

  const logout = () => {
    localStorage.removeItem("meridian_token");
    localStorage.removeItem("meridian_user");
    setToken(null);
    setCurrentUser(null);
  };

  const isAuthenticated = !!token && !!currentUser;
  const currentEmployeeId = currentUser?.id ?? 0;

  return (
    <CurrentUserContext.Provider value={{ token, currentUser, currentEmployeeId, login, logout, isAuthenticated }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return context;
};
