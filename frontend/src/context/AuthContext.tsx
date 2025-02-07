import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  hasAccount: false,
  setIsAuthenticated: (value: boolean) => {},
  setHasAccount: (value: boolean) => {}
});

import { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    // Fetch authentication status and account status from your backend or local storage
    // For example:
    // setIsAuthenticated(true or false);
    // setHasAccount(true or false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, hasAccount, setIsAuthenticated, setHasAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
