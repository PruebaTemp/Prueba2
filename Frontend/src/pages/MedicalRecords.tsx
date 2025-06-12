import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import { 
  FileText, 
  Search, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronRight,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  Shield,
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';

// Tipos de datos
interface Persona {
  id_persona: number;
  prenombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  dni_idcarnet: string;
  sexo: string;
  fecha_nacimiento: string;
  direccion_legal: string;
  correo_electronico?: string;
  numero_celular_personal?: string;
}

interface HistoriaClinica {
  id_historia: number;
  fecha_creacion: string;
  estado: string;
  perfil_medico: {
    id_perfil_medico: number;
    fecha_atencion: string;
    grupo_sanguineo?: string;
    ambiente_residencia?: string;
    orientacion_sexual?: string;
    vida_sexual_activa?: boolean;
  };
  persona?: Persona;
}

interface ServicioMedico {
  id_servicio_medico: number;
  fecha_servicio: string;
  hora_inicio_servicio: string;
  hora_fin_servicio: string;
  cita_medica: {
    id_cita_medica: number;
    estado: string;
    fecha_hora_programada: string;
    personal_medico: {
      persona: Persona;
      especialidad: {
        descripcion: string;
      };
    };
  };
  consulta_medica?: Array<{
    id_consulta_medica: number;
    observaciones_generales?: string;
    motivo_consulta?: string;
    tipo_servicio: {
      nombre: string;
    };
    subtipo_servicio: {
      nombre: string;
    };
  }>;
  diagnostico?: Array<{
    id_diagnostico: number;
    detalle?: string;
    morbilidad: {
      descripcion?: string;
      tipo: string;
      nivel_gravedad?: string;
      cie10: {
        codigo?: string;
        descripcion?: string;
      };
    };
  }>;
  tratamiento?: Array<{
    id_tratamiento: number;
    razon?: string;
    observaciones?: string;
    duracion_cantidad?: number;
    unidad_tiempo: {
      nombre?: string;
    };
  }>;
  examen?: Array<{
    id_examen: number;
    descripcion_procedimiento?: string;
    fecha_hora_atencion: string;
    descripcion?: string;
    tipo_procedimiento?: string;
    tipo_laboratorio?: string;
    resultado?: string;
  }>;
}

const MedicalRecords: React.FC = () => {
  const { user } = useUser();
  const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
  const [serviciosMedicos, setServiciosMedicos] = useState<ServicioMedico[]>([]);
  const [selectedHistoria, setSelectedHistoria] = useState<HistoriaClinica | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Establecer perfil por defecto
      if (!selectedProfile && user.profiles.length > 0) {
        setSelectedProfile(user.currentProfileId);
      }
      fetchHistoriasClinicas();
    }
  }, [user, selectedProfile]);

  const fetchHistoriasClinicas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let historiasData: HistoriaClinica[] = [];

      if (user.currentRole === 'admin') {
        // Administradores: acceso completo a todas las historias clínicas
        const { data, error } = await supabase
          .from('historia_clinica')
          .select(`
            id_historia,
            fecha_creacion,
            estado_historia_clinica!inner(nombre_estado),
            perfil_medico!inner(
              id_perfil_medico,
              fecha_atencion,
              grupo_sanguineo,
              ambiente_residencia,
              orientacion_sexual,
              vida_sexual_activa
            )
          `);

        if (error) throw error;

        // Obtener información de personas para cada historia
        for (const historia of data || []) {
          // Buscar la persona asociada a través del paciente
          const { data: pacienteData } = await supabase
            .from('paciente')
            .select(`
              persona!inner(
                id_persona,
                prenombres,
                primer_apellido,
                segundo_apellido,
                dni_idcarnet,
                sexo,
                fecha_nacimiento,
                direccion_legal,
                correo_electronico,
                numero_celular_personal
              )
            `)
            .eq('id_historia', historia.id_historia)
            .single();

          historiasData.push({
            ...historia,
            estado: historia.estado_historia_clinica?.nombre_estado || 'Desconocido',
            persona: pacienteData?.persona || undefined
          });
        }

      } else if (user.currentRole === 'medical') {
        // Personal médico: solo historias de pacientes con los que han tenido citas
        const { data: citasData, error: citasError } = await supabase
          .from('cita_medica')
          .select(`
            paciente!inner(
              id_historia,
              persona!inner(
                id_persona,
                prenombres,
                primer_apellido,
                segundo_apellido,
                dni_idcarnet,
                sexo,
                fecha_nacimiento,
                direccion_legal,
                correo_electronico,
                numero_celular_personal
              )
            )
          `)
          .eq('personal_medico.persona.id_persona', user.currentProfileId);

        if (citasError) throw citasError;

        // Obtener IDs únicos de historias
        const historiasIds = [...new Set(citasData?.map(cita => cita.paciente.id_historia) || [])];

        if (historiasIds.length > 0) {
          const { data: historiasDataMedico, error: historiasError } = await supabase
            .from('historia_clinica')
            .select(`
              id_historia,
              fecha_creacion,
              estado_historia_clinica!inner(nombre_estado),
              perfil_medico!inner(
                id_perfil_medico,
                fecha_atencion,
                grupo_sanguineo,
                ambiente_residencia,
                orientacion_sexual,
                vida_sexual_activa
              )
            `)
            .in('id_historia', historiasIds);

          if (historiasError) throw historiasError;

          // Asociar personas a las historias
          for (const historia of historiasDataMedico || []) {
            const citaAsociada = citasData?.find(cita => cita.paciente.id_historia === historia.id_historia);
            
            historiasData.push({
              ...historia,
              estado: historia.estado_historia_clinica?.nombre_estado || 'Desconocido',
              persona: citaAsociada?.paciente.persona || undefined
            });
          }
        }

      } else {
        // Pacientes: su propia historia y la de personas asociadas
        const profileIds = user.profiles.map(p => p.id);
        
        for (const profileId of profileIds) {
          const { data: pacienteData, error: pacienteError } = await supabase
            .from('paciente')
            .select(`
              id_historia,
              persona!inner(
                id_persona,
                prenombres,
                primer_apellido,
                segundo_apellido,
                dni_idcarnet,
                sexo,
                fecha_nacimiento,
                direccion_legal,
                correo_electronico,
                numero_celular_personal
              )
            `)
            .eq('id_persona', profileId)
            .single();

          if (!pacienteError && pacienteData) {
            const { data: historiaData, error: historiaError } = await supabase
              .from('historia_clinica')
              .select(`
                id_historia,
                fecha_creacion,
                estado_historia_clinica!inner(nombre_estado),
                perfil_medico!inner(
                  id_perfil_medico,
                  fecha_atencion,
                  grupo_sanguineo,
                  ambiente_residencia,
                  orientacion_sexual,
                  vida_sexual_activa
                )
              `)
              .eq('id_historia', pacienteData.id_historia)
              .single();

            if (!historiaError && historiaData) {
              historiasData.push({
                ...historiaData,
                estado: historiaData.estado_historia_clinica?.nombre_estado || 'Desconocido',
                persona: pacienteData.persona
              });
            }
          }
        }
      }

      setHistorias(historiasData);

    } catch (error) {
      console.error('Error fetching historias clínicas:', error);
      setError('Error al cargar las historias clínicas');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiciosMedicos = async (historiaId: number) => {
    try {
      // Obtener el paciente asociado a la historia
      const { data: pacienteData, error: pacienteError } = await supabase
        .from('paciente')
        .select('id_paciente')
        .eq('id_historia', historiaId)
        .single();

      if (pacienteError) throw pacienteError;

      // Obtener servicios médicos del paciente
      const { data, error } = await supabase
        .from('servicio_medico')
        .select(`
          id_servicio_medico,
          fecha_servicio,
          hora_inicio_servicio,
          hora_fin_servicio,
          cita_medica!inner(
            id_cita_medica,
            estado,
            fecha_hora_programada,
            personal_medico!inner(
              persona!inner(
                prenombres,
                primer_apellido,
                segundo_apellido
              ),
              especialidad!inner(
                descripcion
              )
            )
          ),
          consulta_medica(
            id_consulta_medica,
            observaciones_generales,
            motivo_consulta,
            tipo_servicio!inner(nombre),
            subtipo_servicio!inner(nombre)
          ),
          diagnostico(
            id_diagnostico,
            detalle,
            morbilidad!inner(
              descripcion,
              tipo,
              nivel_gravedad,
              cie10!inner(
                codigo,
                descripcion
              )
            )
          ),
          tratamiento(
            id_tratamiento,
            razon,
            observaciones,
            duracion_cantidad,
            unidad_tiempo!inner(nombre)
          ),
          examen(
            id_examen,
            descripcion_procedimiento,
            fecha_hora_atencion,
            descripcion,
            tipo_procedimiento,
            tipo_laboratorio,
            resultado
          )
        `)
        .eq('cita_medica.id_paciente', pacienteData.id_paciente)
        .order('fecha_servicio', { ascending: false });

      if (error) throw error;

      setServiciosMedicos(data || []);
    } catch (error) {
      console.error('Error fetching servicios médicos:', error);
      setServiciosMedicos([]);
    }
  };

  const handleSelectHistoria = (historia: HistoriaClinica) => {
    setSelectedHistoria(historia);
    fetchServiciosMedicos(historia.id_historia);
  };

  // Filtrar historias según el término de búsqueda
  const filteredHistorias = historias.filter(historia => {
    if (!historia.persona) return false;
    
    const nombreCompleto = `${historia.persona.prenombres} ${historia.persona.primer_apellido} ${historia.persona.segundo_apellido}`.toLowerCase();
    const dni = historia.persona.dni_idcarnet.toLowerCase();
    
    return nombreCompleto.includes(searchTerm.toLowerCase()) || 
           dni.includes(searchTerm.toLowerCase());
  });

  // Filtrar por perfil seleccionado (solo para pacientes)
  const historiasToShow = user?.currentRole === 'patient' && selectedProfile
    ? filteredHistorias.filter(historia => 
        historia.persona?.id_persona.toString() === selectedProfile
      )
    : filteredHistorias;

  if (!user) return null;

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historias clínicas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Historias Clínicas</h1>
        
        {user.currentRole === 'patient' && user.profiles.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Ver historial de:</span>
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {user.profiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} {profile.isCurrentUser && '(Yo)'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Historias */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {historiasToShow.length > 0 ? (
                historiasToShow.map((historia) => (
                  <div
                    key={historia.id_historia}
                    onClick={() => handleSelectHistoria(historia)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedHistoria?.id_historia === historia.id_historia ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {historia.persona ? 
                              `${historia.persona.prenombres} ${historia.persona.primer_apellido} ${historia.persona.segundo_apellido}` 
                              : 'Nombre no disponible'
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            DNI: {historia.persona?.dni_idcarnet || 'No disponible'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Creada: {new Date(historia.fecha_creacion).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          historia.estado === 'Activa' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {historia.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p>No se encontraron historias clínicas</p>
                  {searchTerm && (
                    <p className="text-sm mt-1">
                      Intenta con otro término de búsqueda
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalle de Historia Seleccionada */}
        <div className="lg:col-span-2">
          {selectedHistoria ? (
            <HistoriaDetail 
              historia={selectedHistoria} 
              serviciosMedicos={serviciosMedicos}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Selecciona una Historia Clínica
              </h3>
              <p className="text-gray-600">
                Elige una historia de la lista para ver los detalles completos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar el detalle de una historia clínica
interface HistoriaDetailProps {
  historia: HistoriaClinica;
  serviciosMedicos: ServicioMedico[];
}

const HistoriaDetail: React.FC<HistoriaDetailProps> = ({ historia, serviciosMedicos }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'servicios'>('info');
  const [expandedServicio, setExpandedServicio] = useState<number | null>(null);

  const toggleServicio = (servicioId: number) => {
    setExpandedServicio(expandedServicio === servicioId ? null : servicioId);
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {historia.persona ? 
                `${historia.persona.prenombres} ${historia.persona.primer_apellido} ${historia.persona.segundo_apellido}` 
                : 'Información no disponible'
              }
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Historia Clínica #{historia.id_historia}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              historia.estado === 'Activa' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {historia.estado}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Creada: {new Date(historia.fecha_creacion).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('servicios')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'servicios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Servicios Médicos ({serviciosMedicos.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">DNI</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.persona?.dni_idcarnet || 'No disponible'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexo</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {historia.persona?.sexo === 'M' ? 'Masculino' : historia.persona?.sexo === 'F' ? 'Femenino' : 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {historia.persona?.fecha_nacimiento ? 
                      `${new Date(historia.persona.fecha_nacimiento).toLocaleDateString()} (${calcularEdad(historia.persona.fecha_nacimiento)} años)` 
                      : 'No disponible'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.persona?.numero_celular_personal || 'No disponible'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.persona?.direccion_legal || 'No disponible'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.persona?.correo_electronico || 'No disponible'}</p>
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Perfil Médico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grupo Sanguíneo</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.perfil_medico.grupo_sanguineo || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ambiente de Residencia</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.perfil_medico.ambiente_residencia || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Orientación Sexual</label>
                  <p className="mt-1 text-sm text-gray-900">{historia.perfil_medico.orientacion_sexual || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vida Sexual Activa</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {historia.perfil_medico.vida_sexual_activa === null ? 'No especificado' : 
                     historia.perfil_medico.vida_sexual_activa ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Última Atención</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(historia.perfil_medico.fecha_atencion).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'servicios' && (
          <div className="space-y-4">
            {serviciosMedicos.length > 0 ? (
              serviciosMedicos.map((servicio) => (
                <div key={servicio.id_servicio_medico} className="border border-gray-200 rounded-lg">
                  <div
                    onClick={() => toggleServicio(servicio.id_servicio_medico)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {servicio.cita_medica.personal_medico.persona.prenombres} {servicio.cita_medica.personal_medico.persona.primer_apellido}
                          </p>
                          <p className="text-sm text-gray-500">
                            {servicio.cita_medica.personal_medico.especialidad.descripcion}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(servicio.fecha_servicio).toLocaleDateString()} - 
                            {servicio.hora_inicio_servicio} a {servicio.hora_fin_servicio}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          servicio.cita_medica.estado === 'Completada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {servicio.cita_medica.estado}
                        </span>
                        {expandedServicio === servicio.id_servicio_medico ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedServicio === servicio.id_servicio_medico && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-4">
                        {/* Consulta Médica */}
                        {servicio.consulta_medica && servicio.consulta_medica.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Consulta Médica
                            </h4>
                            {servicio.consulta_medica.map((consulta) => (
                              <div key={consulta.id_consulta_medica} className="bg-white p-3 rounded border">
                                <p className="text-sm"><strong>Tipo:</strong> {consulta.tipo_servicio.nombre} - {consulta.subtipo_servicio.nombre}</p>
                                {consulta.motivo_consulta && (
                                  <p className="text-sm mt-1"><strong>Motivo:</strong> {consulta.motivo_consulta}</p>
                                )}
                                {consulta.observaciones_generales && (
                                  <p className="text-sm mt-1"><strong>Observaciones:</strong> {consulta.observaciones_generales}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Diagnósticos */}
                        {servicio.diagnostico && servicio.diagnostico.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                              <Activity className="h-4 w-4 mr-2" />
                              Diagnósticos
                            </h4>
                            {servicio.diagnostico.map((diagnostico) => (
                              <div key={diagnostico.id_diagnostico} className="bg-white p-3 rounded border">
                                <p className="text-sm">
                                  <strong>CIE-10:</strong> {diagnostico.morbilidad.cie10.codigo} - {diagnostico.morbilidad.cie10.descripcion}
                                </p>
                                <p className="text-sm mt-1"><strong>Tipo:</strong> {diagnostico.morbilidad.tipo}</p>
                                {diagnostico.morbilidad.nivel_gravedad && (
                                  <p className="text-sm mt-1"><strong>Gravedad:</strong> {diagnostico.morbilidad.nivel_gravedad}</p>
                                )}
                                {diagnostico.detalle && (
                                  <p className="text-sm mt-1"><strong>Detalle:</strong> {diagnostico.detalle}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tratamientos */}
                        {servicio.tratamiento && servicio.tratamiento.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Tratamientos
                            </h4>
                            {servicio.tratamiento.map((tratamiento) => (
                              <div key={tratamiento.id_tratamiento} className="bg-white p-3 rounded border">
                                {tratamiento.razon && (
                                  <p className="text-sm"><strong>Razón:</strong> {tratamiento.razon}</p>
                                )}
                                {tratamiento.duracion_cantidad && (
                                  <p className="text-sm mt-1">
                                    <strong>Duración:</strong> {tratamiento.duracion_cantidad} {tratamiento.unidad_tiempo.nombre}
                                  </p>
                                )}
                                {tratamiento.observaciones && (
                                  <p className="text-sm mt-1"><strong>Observaciones:</strong> {tratamiento.observaciones}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Exámenes */}
                        {servicio.examen && servicio.examen.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Exámenes
                            </h4>
                            {servicio.examen.map((examen) => (
                              <div key={examen.id_examen} className="bg-white p-3 rounded border">
                                {examen.tipo_procedimiento && (
                                  <p className="text-sm"><strong>Tipo:</strong> {examen.tipo_procedimiento}</p>
                                )}
                                {examen.tipo_laboratorio && (
                                  <p className="text-sm mt-1"><strong>Laboratorio:</strong> {examen.tipo_laboratorio}</p>
                                )}
                                {examen.descripcion_procedimiento && (
                                  <p className="text-sm mt-1"><strong>Procedimiento:</strong> {examen.descripcion_procedimiento}</p>
                                )}
                                {examen.resultado && (
                                  <p className="text-sm mt-1"><strong>Resultado:</strong> {examen.resultado}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  Fecha: {new Date(examen.fecha_hora_atencion).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p>No hay servicios médicos registrados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;