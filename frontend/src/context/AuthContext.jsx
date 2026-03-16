import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock user roles
const MOCK_USERS = {
  'admin@cybershield.gov': { password: 'Admin@123', role: 'Admin', name: 'Admin User' },
  'analyst@cybershield.gov': { password: 'Analyst@123', role: 'Analyst', name: 'Data Analyst' },
  'officer@cybershield.gov': { password: 'Officer@123', role: 'Field Officer', name: 'Field Officer' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cybershield_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = MOCK_USERS[email];
    if (found && found.password === password) {
      const userData = { email, role: found.role, name: found.name };
      setUser(userData);
      localStorage.setItem('cybershield_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cybershield_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
