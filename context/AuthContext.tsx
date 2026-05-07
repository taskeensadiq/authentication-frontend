
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';

// type DecodedUser = {
//   sub: string;
//   email: string;
//   roles: string[];
//   permissions: string[];
//   exp: number;
// };

// interface AuthContextType {
//   token: string | null;
//   user: DecodedUser | null;
//   login: (token: string) => void;
//   logout: () => void;
//   hasPermission: (perm: string) => boolean;
//   hasRole: (role: string) => boolean;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// const isTokenExpired = (token: string) => {
//   try {
//     const decoded: any = jwtDecode(token);
//     return decoded.exp * 1000 < Date.now();
//   } catch {
//     return true;
//   }
// };

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [token, setToken] = useState<string | null>(null);
//   // const [user, setUser] = useState<DecodedUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [user, setUser] = useState(null);

//   const fetchwhoami = async (token?: string) => {
//     const t = token || localStorage.getItem('token');

//     if (!t) return;

//     const res = await fetch('http://localhost:4000/auth/whoami', {
//       headers: {
//         Authorization: `Bearer ${t}`,
//       },
//     });

//     const data = await res.json();

//     setUser(data);
//   };

//   useEffect(() => {
//     const t = localStorage.getItem('token');

//     if (t && !isTokenExpired(t)) {
//       setToken(t);
//       setUser(jwtDecode<DecodedUser>(t));
//     } else {
//       localStorage.removeItem('token');
//     }

//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     const decoded: any = jwtDecode(token);
//     const timeout = decoded.exp * 1000 - Date.now();

//     if (timeout > 0) {
//       const timer = setTimeout(logout, timeout);
//       return () => clearTimeout(timer);
//     } else {
//       logout();
//     }
//   }, [token]);

//   const login = (token: string) => {
//     localStorage.setItem('token', token);
//     setToken(token);
//     setUser(jwtDecode<DecodedUser>(token));
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//   };

//   const hasPermission = (perm: string) =>
//     user?.permissions?.includes(perm) || false;

//   const hasRole = (role: string) =>
//     user?.roles?.includes(role) || false;

//   return (
//     <AuthContext.Provider
//       value={{ token, user, login, logout, hasPermission, hasRole, loading, fetchwhoami }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used inside provider');
//   return ctx;
// };


'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  fetchWhoAmI: (token?: string) => Promise<void>;
  hasPermission: (perm: string) => boolean;
  hasRole: (role: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const isTokenExpired = (token: string) => {
  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWhoAmI = async (t?: string) => {
    const tokenToUse = t || localStorage.getItem('token');
    if (!tokenToUse) return;

    try {
      const res = await fetch('http://localhost:4000/auth/whoami', {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('whoami failed', err);
    }
  };

  useEffect(() => {
    const t = localStorage.getItem('token');

    if (t && !isTokenExpired(t)) {
      setToken(t);
      fetchWhoAmI(t); 
    } else {
      localStorage.removeItem('token');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const timeout = decoded.exp * 1000 - Date.now();

    if (timeout > 0) {
      const timer = setTimeout(logout, timeout);
      return () => clearTimeout(timer);
    } else {
      logout();
    }
  }, [token]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    fetchWhoAmI(token); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (perm: string) =>
    user?.permissions?.includes(perm) || false;

  const hasRole = (role: string) =>
    user?.roles?.includes(role) || false;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        fetchWhoAmI,
        hasPermission,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside provider');
  return ctx;
};