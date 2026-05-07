// 'use client';

// import { UserRole } from '@/lib/permissions';
// import { createContext, useContext, useEffect, useState } from 'react';

// type RoleContextType = {
//   role: UserRole[];
//   setRole: (role: UserRole[]) => void;
//   loading: boolean;
// };

// const RoleContext = createContext<RoleContextType | null>(null);

// export function RoleProvider({ children }: { children: React.ReactNode }) {
//   const [role, setRoleState] = useState<UserRole[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadRole = () => {
//       const stored = localStorage.getItem('role');
//       try {
//         const parsed = stored ? JSON.parse(stored) : [];
//         setRoleState(Array.isArray(parsed) ? parsed : []);
//       } catch {
//         setRoleState([]);
//       }
//     };

//     loadRole();
//     const handleStorage = (event: StorageEvent) => {
//       if (event.key === 'role') {
//         loadRole();
//       }
//     };

//     window.addEventListener('storage', handleStorage);
//     setLoading(false);

//     return () => window.removeEventListener('storage', handleStorage);
//   }, []);

//   const setRole = (newRole: UserRole[]) => {
//     setRoleState(newRole);
//     localStorage.setItem('role', JSON.stringify(newRole));
//   };

//   return (
//     <RoleContext.Provider value={{ role, setRole, loading }}>
//       {children}
//     </RoleContext.Provider>
//   );
// }

// export const useRoles = () => {
//   const ctx = useContext(RoleContext);
//   if (!ctx) throw new Error('useRoles must be used inside RoleProvider');
//   return ctx;
// };