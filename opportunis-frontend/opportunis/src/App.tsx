import { BrowserRouter } from "react-router-dom";

import { AppThemeProvider, DrawerProvider } from "./shared/contexts";
import { AppRoutes } from "./routes";
import "./App.css";
import { AuthProvider } from "./shared/authContext/authContext";

export const App = () => {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
};
