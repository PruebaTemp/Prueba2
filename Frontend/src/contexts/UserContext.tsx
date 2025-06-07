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
  // Información adicional del usuario
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  switchProfile: (profileId: string) => void;
  isRoleAllowed: (requiredRole: UserRole) => boolean;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  switchRole: () => {},
  switchProfile: () => {},
  isRoleAllowed: () => false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener los roles del usuario
  const getUserRoles = async (idPersona: number): Promise<UserRole[]> => {
    try {
      // Luego obtener los roles
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
      console.log(rolesData);
      rolesData?.forEach((roleAssignment: any) => {
        const roleName = roleAssignment.rol?.nombre;
        if (roleName === 'Paciente') roles.push('patient');
        if (roleName === 'Asistente Administrativo') roles.push('admin');
        if (roleName === 'Personal Médico' || roleName === 'personal_medico') roles.push('medical');
      });

      return roles.length > 0 ? roles : ['patient'];
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      return ['patient'];
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
      console.log('Construyendo usuario desde metadata:', authUser.user_metadata);

      // Validación básica
      if (!authUser.user_metadata) {
        throw new Error('Metadatos de usuario no encontrados');
      }

      const { id_persona, nombre_usuario } = authUser.user_metadata;

      if (!id_persona) {
        throw new Error('ID de persona no encontrado en metadata');
      }

      console.log('Obteniendo datos de persona con ID:', id_persona);

      // 1. Obtener datos de persona
      const { data: personaData, error: personaError } = await supabase
          .from('persona')
          .select('*')
          .eq('id_persona', id_persona)
          .single();

      if (personaError) {
        console.error('Error al obtener persona:', personaError);
        throw personaError;
      }

      if (!personaData) {
        throw new Error(`No se encontró persona con ID ${id_persona}`);
      }

      console.log('Datos de persona obtenidos:', personaData);

      // 2. Obtener roles
      console.log('Obteniendo roles para persona ID:', id_persona);
      const roles = await getUserRoles(id_persona);
      console.log('Roles obtenidos:', roles);

      // 3. Obtener perfiles
      console.log('Obteniendo perfiles para persona ID:', id_persona);
      const profiles = await getUserProfiles(id_persona.toString());
      console.log('Perfiles obtenidos:', profiles);

      // Construir objeto de usuario
      const userObj: User = {
        id: authUser.id,
        name: `${personaData.prenombres || ''} ${personaData.primer_apellido || ''} ${personaData.segundo_apellido || ''}`.trim(),
        email: authUser.email || '',
        currentRole: roles[0],
        roles,
        profiles,
        currentProfileId: id_persona.toString(),
        dni: personaData.dni_idcarnet,
        telefono: personaData.numero_celular_personal,
        direccion: personaData.direccion_legal,
        nombreUsuario: nombre_usuario || ''
      };

      console.log('Usuario construido con éxito:', userObj);
      return userObj;

    } catch (error) {
      console.error('Error crítico en buildUserFromSupabase:', error);
      throw new Error(`No se pudo construir el usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('Verificando sesión existente...'); // Debug
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('Sesión encontrada, construyendo usuario...'); // Debug
          const userData = await buildUserFromSupabase(session.user);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Sesión cargada correctamente'); // Debug
        } else {
          console.log('No se encontró sesión activa'); // Debug
        }
      } catch (error) {
        console.error('Error obteniendo sesión:', error);
      } finally {
        setLoading(false);
        console.log('Verificación de sesión completada'); // Debug
      }
    };

    getSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`Evento de autenticación: ${event}`); // Debug
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              console.log('Usuario autenticado, construyendo usuario...'); // Debug
              const userData = await buildUserFromSupabase(session.user);
              setUser(userData);
              setIsAuthenticated(true);
              console.log('Usuario autenticado correctamente'); // Debug
            } catch (error) {
              console.error('Error en login:', error);
              setUser(null);
              setIsAuthenticated(false);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('Usuario cerró sesión'); // Debug
            setUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false);
          console.log('Estado loading actualizado después de evento auth'); // Debug
        }
    );

    return () => {
      console.log('Limpiando suscripción a cambios de autenticación'); // Debug
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const userData = await buildUserFromSupabase(data.user);

        // Actualiza ambos estados al mismo tiempo
        setUser(userData);
        setIsAuthenticated(true);

        return true; // Indica que el login fue exitoso
      }
      return false;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
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
    return user?.currentRole === requiredRole;
  };

  return (
      <UserContext.Provider
          value={{
            user,
            isAuthenticated,
            loading,
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