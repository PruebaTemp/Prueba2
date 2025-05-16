import React, { createContext, useState, useContext, useEffect } from 'react';

// Define user role types
export type UserRole = 'patient' | 'admin' | 'medical';

// Define user profile type
export interface UserProfile {
  id: string;
  name: string;
  isCurrentUser: boolean;
}

// Define medical order type
export interface MedicalOrder {
  id: string;
  type: 'exam' | 'surgery' | 'therapy' | 'consultation';
  description: string;
  specialty: string;
  doctorName: string;
  orderDate: string;
  status: 'pending' | 'scheduled' | 'completed';
}

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  currentRole: UserRole;
  roles: UserRole[];
  avatarUrl?: string;
  profiles: UserProfile[];
  currentProfileId: string;
  medicalOrders?: MedicalOrder[];
}

// Define context type
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchProfile: (profileId: string) => void;
  isRoleAllowed: (requiredRole: UserRole) => boolean;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  switchRole: () => {},
  switchProfile: () => {},
  isRoleAllowed: () => false,
});

// Sample user data for demo
const sampleUser: User = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  currentRole: 'patient',
  roles: ['patient', 'admin', 'medical'],
  avatarUrl: '../images/user.jpeg',
  profiles: [
    { id: '1', name: 'Juan Pérez', isCurrentUser: true },
    { id: '2', name: 'Martina Pérez', isCurrentUser: false },
    { id: '3', name: 'Mateo Pérez', isCurrentUser: false },
  ],
  currentProfileId: '1',
  medicalOrders: [
    {
      id: '1',
      type: 'exam',
      description: 'Radiografía de tórax',
      specialty: 'Radiología',
      doctorName: 'Dr. María González',
      orderDate: '2025-06-10',
      status: 'pending'
    },
    {
      id: '2',
      type: 'therapy',
      description: 'Terapia física - Rehabilitación de rodilla',
      specialty: 'Medicina Física y Rehabilitación',
      doctorName: 'Dr. Carlos Ruiz',
      orderDate: '2025-06-08',
      status: 'pending'
    }
  ]
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // For demo purposes, auto-login with sample user
  useEffect(() => {
    // Comment this line to disable auto-login for production
    setUser(sampleUser);
    setIsAuthenticated(true);
  }, []);

  const login = async () => {
    // In a real app, this would make an API call to authenticate
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always succeed for demo
      setUser(sampleUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    if (user && user.roles.includes(role)) {
      setUser({ ...user, currentRole: role });
    }
  };

  const switchProfile = (profileId: string) => {
    if (user) {
      const profileExists = user.profiles.some(profile => profile.id === profileId);
      if (profileExists) {
        setUser({ ...user, currentProfileId: profileId });
      }
    }
  };

  const isRoleAllowed = (requiredRole: UserRole): boolean => {
    return user?.currentRole === requiredRole;
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        switchRole, 
        switchProfile,
        isRoleAllowed
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);