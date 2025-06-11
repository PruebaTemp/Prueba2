import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define user role types
export type UserRole = 'patient' | 'admin' | 'medical';

// Define user profile type
export interface UserProfile {
  id: string;
  name: string;
  isCurrentUser: boolean;
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
  dni?: string;
  telefono?: string;
  direccion?: string;
  nombreUsuario?: string;
}

// Define context type
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  switchProfile: (profileId: string) => void;
  isRoleAllowed: (requiredRole: UserRole) => boolean;
  clearError: () => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => false,
  logout: async () => {},
  switchRole: () => {},
  switchProfile: () => {},
  isRoleAllowed: () => false,
  clearError: () => {}
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Función para obtener los roles del usuario
  const getUserRoles = async (idPersona: number): Promise<UserRole[]> => {
    try {
      const { data: rolesData, error } = await supabase
        .from('asignacion_rol')
        .select(`
          rol:id_rol (
            nombre
          )
        `)
        .eq('id_persona', idPersona);

      if (error) throw error;

      const roles: UserRole[] = [];
      rolesData?.forEach((roleAssignment: any) => {
        const roleName = roleAssignment.rol?.nombre;
        if (roleName === 'Paciente') roles.push('patient');
        if (roleName === 'Asistente Administrativo') roles.push('admin');
        if (roleName === 'Personal Médico' || roleName === 'personal_medico') roles.push('medical');
      });

      // Validar que tenga al menos un rol
      if (roles.length === 0) {
        throw new Error('El usuario no tiene roles asignados. Contacte al administrador.');
      }

      return roles;
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      throw error; // Re-lanzamos el error para manejarlo en el contexto superior
    }
  };

  // Función para obtener perfiles familiares
  const getUserProfiles = async (personaId: string): Promise<UserProfile[]> => {
    try {
      const profiles: UserProfile[] = [];

      // Obtener datos de la persona principal
      const { data: personaData, error: personaError } = await supabase
          .from('persona')
          .select('id_persona, prenombres, primer_apellido, segundo_apellido')
          .eq('id_persona', personaId)
          .single();

      if (personaError) throw personaError;

      // Agregar perfil principal
      profiles.push({
        id: personaData.id_persona.toString(),
        name: `${personaData.prenombres} ${personaData.primer_apellido} ${personaData.segundo_apellido}`,
        isCurrentUser: true
      });

      // Obtener familiares relacionados
      const { data: relacionesData, error: relacionesError } = await supabase
          .from('relacion_personas')
          .select(`
          id_persona_2,
          persona:id_persona_2 (
            id_persona,
            prenombres,
            primer_apellido,
            segundo_apellido
          ),
          tipo_relacion:id_tipo_relacion (
            nombre
          )
        `)
          .eq('id_persona_1', personaId)
          .is('fecha_expiracion', null); // Solo relaciones activas

      if (!relacionesError && relacionesData) {
        relacionesData.forEach((relacion: any) => {
          if (relacion.persona) {
            profiles.push({
              id: relacion.persona.id_persona.toString(),
              name: `${relacion.persona.prenombres} ${relacion.persona.primer_apellido} ${relacion.persona.segundo_apellido}`,
              isCurrentUser: false
            });
          }
        });
      }

      return profiles;
    } catch (error) {
      console.error('Error obteniendo perfiles:', error);
      return [];
    }
  };

  // Función para construir el usuario desde los datos de Supabase
  const buildUserFromSupabase = async (authUser: any): Promise<User> => {
    try {
      if (!authUser.user_metadata) {
        throw new Error('Metadatos de usuario no encontrados');
      }

      const { id_persona, nombre_usuario } = authUser.user_metadata;

      if (!id_persona) {
        throw new Error('ID de persona no encontrado en metadata');
      }

      // 1. Obtener datos de persona
      const { data: personaData, error: personaError } = await supabase
        .from('persona')
        .select('*')
        .eq('id_persona', id_persona)
        .single();

      if (personaError) throw personaError;
      if (!personaData) throw new Error(`No se encontró persona con ID ${id_persona}`);

      // 2. Obtener roles (puede lanzar error si no tiene roles)
      const roles = await getUserRoles(id_persona);

      // 3. Obtener perfiles
      const profiles = await getUserProfiles(id_persona.toString());

      return {
        id: authUser.id,
        name: `${personaData.prenombres || ''} ${personaData.primer_apellido || ''} ${personaData.segundo_apellido || ''}`.trim(),
        email: authUser.email || '',
        currentRole: roles[0], // Asignamos el primer rol disponible
        roles,
        profiles,
        currentProfileId: id_persona.toString(),
        dni: personaData.dni_idcarnet,
        telefono: personaData.numero_celular_personal,
        direccion: personaData.direccion_legal,
        nombreUsuario: nombre_usuario || ''
      };
    } catch (error) {
      console.error('Error en buildUserFromSupabase:', error);
      throw error;
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          try {
            const userData = await buildUserFromSupabase(session.user);
            setUser(userData);
            setIsAuthenticated(true);
            setError(null);
          } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar usuario');
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Error obteniendo sesión:', error);
        setError('Error al verificar la sesión');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setLoading(true);
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const userData = await buildUserFromSupabase(session.user);
            setUser(userData);
            setIsAuthenticated(true);
            setError(null);
          } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al autenticar usuario');
            await supabase.auth.signOut();
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          setError(null);
        }
      } catch (error) {
        console.error('Error en auth state change:', error);
        setError('Error en el proceso de autenticación');
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        try {
          const userData = await buildUserFromSupabase(data.user);
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        } catch (buildError) {
          await supabase.auth.signOut();
          throw buildError;
        }
      }
      return false;
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      setError('Error al cerrar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
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
    return user?.roles.includes(requiredRole) || false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        switchRole,
        switchProfile,
        isRoleAllowed,
        clearError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);