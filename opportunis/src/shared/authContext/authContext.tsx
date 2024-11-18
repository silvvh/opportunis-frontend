import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  role: string | null;
  setAuth: (token: string | null, role: string | null) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token") || null;
    const roleFromCookie = Cookies.get("role") || null;

    setToken(tokenFromCookie);
    setRole(roleFromCookie);
  }, []);

  const setAuth = (newToken: string | null, newRole: string | null) => {
    if (newToken) {
      Cookies.set("token", newToken);
      setToken(newToken);
    } else {
      Cookies.remove("token");
      setToken(null);
    }

    if (newRole) {
      Cookies.set("role", newRole);
      setRole(newRole);
    } else {
      Cookies.remove("role");
      setRole(null);
    }
  };

  // Limpa autenticação
  const clearAuth = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  console.debug(context);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
