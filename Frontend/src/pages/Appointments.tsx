import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  X,
  CheckCircle,
  Plus,
  FileText,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';

// Configurar el modal para la aplicación
Modal.setAppElement('#root');

type Appointment = {
  id_cita_medica: number;
  id_paciente: number;
  id_personal_medico: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Programada';
  fecha_hora_programada: string;
  fecha_hora_registro: string;
  paciente: {
    persona: {
      prenombres: string;
      primer_apellido: string;
      segundo_apellido: string;
    };
  };
  personal_medico: {
    persona: {
      prenombres: string;
      primer_apellido: string;
      segundo_apellido: string;
    };
    especialidad: {
      descripcion: string;
    };
  };
  servicio_medico?: {
    fecha_servicio: string;
    hora_inicio_servicio: string;
    hora_fin_servicio: string;
  };
  cita_con_orden?: {
    orden_medica: {
      subtipo_servicio: {
        nombre: string;
        tipo_servicio: {
          nombre: string;
        };
      };
    };
  };
  cita_sin_orden?: {
    subtipo_servicio: {
      nombre: string;
      tipo_servicio: {
        nombre: string;
      };
    };
  };
};

type Profile = {
  id_paciente: number;
  id_persona: number;
  id_historia: number;
  persona: {
    prenombres: string;
    primer_apellido: string;
    segundo_apellido: string;
  };
  isCurrentUser: boolean;
};

type MedicalOrder = {
  id_orden: number;
  motivo: string;
  observaciones: string;
  id_subtipo_servicio: number;
  subtipo_servicio: {
    nombre: string;
    id_tipo_servicio: number;
    tipo_servicio: {
      nombre: string;
    };
  };
  servicio_medico: {
    fecha_servicio: string;
    cita_medica: {
      paciente: {
        id_paciente: number;
      };
    };
  };
};

type Specialty = {
  id_especialidad: number;
  descripcion: string;
};

type Doctor = {
  id_personal_medico: number;
  id_persona: number;
  id_especialidad: number;
  persona: {
    prenombres: string;
    primer_apellido: string;
    segundo_apellido: string;
  };
  especialidad: {
    descripcion: string;
  };
  habilitado: boolean;
};

const Appointments: React.FC = () => {
  const { user } = useUser();
  const [view, setView] = useState<'list' | 'create'>('list');
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  if (!user || user.currentRole !== 'patient') {
    return (
        <div className="container mx-auto text-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">
            Solo los pacientes pueden acceder a esta sección.
          </p>
        </div>
    );
  }

  return (
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {view === 'list' ? 'Citas Médicas' : 'Programar Nueva Cita'}
          </h1>

          {view === 'list' && (
              <button
                  onClick={() => setView('create')}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Programar Cita
              </button>
          )}
        </div>

        {view === 'list'
            ? <PatientAppointmentsList
                onCreateNew={() => setView('create')}
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
            />
            : <CreateAppointment
                onCancel={() => setView('list')}
                onSuccess={() => setView('list')}
                selectedProfile={selectedProfile}
            />}
      </div>
  );
};

const PatientAppointmentsList: React.FC<{
  onCreateNew: () => void,
  selectedProfile: number | null,
  setSelectedProfile: (id: number) => void
}> = ({ onCreateNew, selectedProfile, setSelectedProfile }) => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showProfileSelection, setShowProfileSelection] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Obtener perfiles de pacientes asociados al usuario
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);

        // 1. Obtener datos del perfil principal
        const { data: mainPersona, error: personaError } = await supabase
            .from('persona')
            .select('prenombres, primer_apellido, segundo_apellido')
            .eq('id_persona', user?.currentProfileId)
            .single();

        if (personaError) throw personaError;

        const { data: mainPaciente, error: pacienteError } = await supabase
            .from('paciente')
            .select('id_paciente, id_persona, id_historia')
            .eq('id_persona', user?.currentProfileId)
            .single();

        if (pacienteError) throw pacienteError;

        const mainProfile = {
          ...mainPaciente,
          persona: mainPersona,
          isCurrentUser: true
        };

        // 2. Obtener perfiles de dependientes
        const { data: relaciones, error: relacionesError } = await supabase
            .from('relacion_personas')
            .select('id_persona_2')
            .eq('id_persona_1', user?.currentProfileId)
            .eq('id_tipo_relacion', 1);

        if (relacionesError) throw relacionesError;

        const relatedProfiles = await Promise.all(
            relaciones.map(async (relacion) => {
              const { data: dependientePersona, error: dpError } = await supabase
                  .from('persona')
                  .select('prenombres, primer_apellido, segundo_apellido')
                  .eq('id_persona', relacion.id_persona_2)
                  .single();

              if (dpError) throw dpError;

              const { data: dependientePaciente, error: dPacError } = await supabase
                  .from('paciente')
                  .select('id_paciente, id_persona, id_historia')
                  .eq('id_persona', relacion.id_persona_2)
                  .single();

              if (dPacError) throw dPacError;

              return {
                ...dependientePaciente,
                persona: dependientePersona,
                isCurrentUser: false
              };
            })
        );

        const allProfiles = [mainProfile, ...relatedProfiles];
        setProfiles(allProfiles);

        if (allProfiles.length === 1) {
          setSelectedProfile(allProfiles[0].id_paciente);
        } else if (!selectedProfile) {
          setShowProfileSelection(true);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Error al cargar los perfiles de pacientes');
      } finally {
        setLoading(false);
      }
    };

    if (user?.currentProfileId) {
      fetchProfiles();
    }
  }, [user]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedProfile) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
            .from('cita_medica')
            .select(`
            id_cita_medica,
            id_paciente,
            id_personal_medico,
            estado,
            fecha_hora_programada,
            fecha_hora_registro,
            paciente: id_paciente (
              persona: id_persona (
                prenombres,
                primer_apellido,
                segundo_apellido
              )
            ),
            personal_medico: id_personal_medico (
              persona: id_persona (
                prenombres,
                primer_apellido,
                segundo_apellido
              ),
              especialidad: id_especialidad (descripcion)
            ),
            servicio_medico: servicio_medico (
              fecha_servicio,
              hora_inicio_servicio,
              hora_fin_servicio
            ),
            cita_con_orden: cita_con_orden (
              orden_medica: id_orden (
                subtipo_servicio: id_subtipo_servicio (
                  nombre,
                  tipo_servicio: id_tipo_servicio (nombre)
                )
              )
            ),
            cita_sin_orden: cita_sin_orden (
              subtipo_servicio: id_subtipo_servicio (
                nombre,
                  tipo_servicio: id_tipo_servicio (nombre)
              )
            )
          `)
            .eq('id_paciente', selectedProfile)
            .order('fecha_hora_programada', { ascending: false });

        if (error) throw error;

        setAppointments(data || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error al cargar las citas médicas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedProfile]);

  const getServiceType = (appointment: Appointment) => {
    if (appointment.cita_con_orden) {
      return {
        type: appointment.cita_con_orden.orden_medica.subtipo_servicio.tipo_servicio.nombre,
        subtype: appointment.cita_con_orden.orden_medica.subtipo_servicio.nombre
      };
    }
    if (appointment.cita_sin_orden) {
      return {
        type: appointment.cita_sin_orden.subtipo_servicio.tipo_servicio.nombre,
        subtype: appointment.cita_sin_orden.subtipo_servicio.nombre
      };
    }
    return { type: 'Consulta general', subtype: 'Consulta general' };
  };

  const openCancelModal = (appointmentId: number) => {
    setAppointmentToCancel(appointmentId);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setAppointmentToCancel(null);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      const { error } = await supabase
          .from('cita_medica')
          .update({ estado: 'Cancelada' })
          .eq('id_cita_medica', appointmentToCancel);

      if (error) throw error;

      setAppointments(prev =>
          prev.map(a =>
              a.id_cita_medica === appointmentToCancel
                  ? { ...a, estado: 'Cancelada' }
                  : a
          )
      );
      closeCancelModal();
    } catch (err) {
      console.error('Error canceling appointment:', err);
      alert('No se pudo cancelar la cita');
    }
  };

  const isFutureAppointment = (appointment: Appointment) => {
    if (appointment.estado === 'Completada' || appointment.estado === 'Cancelada') {
      return false;
    }

    const now = new Date();
    const appointmentDate = new Date(appointment.fecha_hora_programada);

    return appointmentDate > now;
  };

  const getAppointmentDate = (appointment: Appointment) => {
    if (appointment.estado === 'Completada' && appointment.servicio_medico?.length > 0) {
      return new Date(appointment.servicio_medico[0].fecha_servicio);
    }
    return new Date(appointment.fecha_hora_programada);
  };

  const getAppointmentTime = (appointment: Appointment) => {
    if (appointment.estado === 'Completada' && appointment.servicio_medico?.length > 0) {
      return appointment.servicio_medico[0].hora_inicio_servicio.substring(0, 5);
    }

    const date = new Date(appointment.fecha_hora_programada);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    }
    return timeString;
  };

  if (showProfileSelection) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Seleccione el Paciente</h2>
          {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map(profile => (
                    <button
                        key={profile.id_paciente}
                        onClick={() => {
                          setSelectedProfile(profile.id_paciente);
                          setShowProfileSelection(false);
                        }}
                        className={`p-4 border rounded-md text-left transition-colors ${
                            selectedProfile === profile.id_paciente
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium">
                            {profile.persona.prenombres} {profile.persona.primer_apellido}
                          </p>
                          <p className="text-sm text-gray-500">
                            {profile.isCurrentUser ? 'Titular' : 'Dependiente'}
                          </p>
                        </div>
                      </div>
                    </button>
                ))}
              </div>
          )}
        </div>
    );
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">{error}</p>
        </div>
    );
  }

  // Modal de confirmación para cancelar cita
  const CancelConfirmationModal = () => (
      <Modal
          isOpen={isCancelModalOpen}
          onRequestClose={closeCancelModal}
          className="modal"
          overlayClassName="modal-overlay"
          contentLabel="Confirmar Cancelación"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium">Confirmar Cancelación</h3>
          </div>
          <p className="text-gray-600 mb-6">
            ¿Está seguro que desea cancelar esta cita? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <button
                onClick={closeCancelModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Volver
            </button>
            <button
                onClick={confirmCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirmar Cancelación
            </button>
          </div>
        </div>
      </Modal>
  );

  const upcomingAppointments = appointments.filter(isFutureAppointment);
  const pastAppointments = appointments.filter(a => !isFutureAppointment(a));

  return (
      <div className="space-y-8">
        <CancelConfirmationModal />

        {/* Próximas Citas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Próximas Citas</h2>
              {profiles.length > 1 && (
                  <button
                      onClick={() => setShowProfileSelection(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Cambiar perfil
                  </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appointment => {
                  const appointmentDate = getAppointmentDate(appointment);
                  const appointmentTime = getAppointmentTime(appointment);
                  const serviceType = getServiceType(appointment);

                  return (
                      <div key={appointment.id_cita_medica} className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Dr. {appointment.personal_medico.persona.prenombres.split(' ')[0]} {appointment.personal_medico.persona.primer_apellido}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.personal_medico.especialidad.descripcion}
                            </p>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-sm">
                                <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{formatDate(appointmentDate)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{formatTime(appointmentTime)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{serviceType.type} - {serviceType.subtype}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 md:mt-0">
                            <button
                                onClick={() => openCancelModal(appointment.id_cita_medica)}
                                className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm w-full md:w-auto"
                                disabled={appointment.estado === 'Cancelada'}
                            >
                              {appointment.estado === 'Cancelada' ? 'Cancelada' : 'Cancelar Cita'}
                            </button>
                          </div>
                        </div>
                      </div>
                  );
                })
            ) : (
                <div className="p-6 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No tienes citas programadas</p>
                  <button
                      onClick={onCreateNew}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Programar una cita
                  </button>
                </div>
            )}
          </div>
        </div>

        {/* Historial de Citas */}
        {pastAppointments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800">Historial de Citas</h2>
                  {profiles.length > 1 && (
                      <button
                          onClick={() => setShowProfileSelection(true)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Cambiar perfil
                      </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {pastAppointments.map(appointment => {
                  const appointmentDate = getAppointmentDate(appointment);
                  const appointmentTime = getAppointmentTime(appointment);
                  const serviceType = getServiceType(appointment);

                  return (
                      <div key={appointment.id_cita_medica} className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Dr. {appointment.personal_medico.persona.prenombres.split(' ')[0]} {appointment.personal_medico.persona.primer_apellido}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.personal_medico.especialidad.descripcion}
                            </p>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-sm">
                                <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{formatDate(appointmentDate)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{formatTime(appointmentTime)}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className={`${
                                    appointment.estado.toLowerCase() === 'completada'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}>
                            {appointment.estado === 'Completada' ? 'Completada' : 'Cancelada'}
                          </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{serviceType.type} - {serviceType.subtype}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>
        )}
      </div>
  );
};

const CreateAppointment: React.FC<{
  onCancel: () => void,
  onSuccess: () => void,
  selectedProfile: number | null
}> = ({ onCancel, onSuccess, selectedProfile }) => {
  const [step, setStep] = useState<'order' | 'specialty' | 'doctor' | 'datetime'>('order');
  const [selectedOrder, setSelectedOrder] = useState<MedicalOrder | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [orders, setOrders] = useState<MedicalOrder[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState<{
    persona: {
      prenombres: string;
      primer_apellido: string;
      segundo_apellido: string;
    };
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedProfile) return;

      try {
        // 1. Obtener el id_persona del paciente
        const { data: paciente, error: pacienteError } = await supabase
            .from('paciente')
            .select('id_persona')
            .eq('id_paciente', selectedProfile)
            .single();

        if (pacienteError) throw pacienteError;

        // 2. Obtener los datos de la persona
        const { data: persona, error: personaError } = await supabase
            .from('persona')
            .select('prenombres, primer_apellido, segundo_apellido')
            .eq('id_persona', paciente.id_persona)
            .single();

        if (personaError) throw personaError;

        setCurrentProfile({ persona });
      } catch (err) {
        console.error('Error al cargar el perfil:', err);
      }
    };

    fetchProfile();
  }, [selectedProfile]);

  // Obtener órdenes médicas cuando se selecciona un perfil
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedProfile) return;

      try {
        setLoading(prev => ({ ...prev, orders: true }));

        const { data, error } = await supabase
            .from('orden_medica')
            .select(`
              id_orden,
              motivo,
              observaciones,
              id_subtipo_servicio,
              subtipo_servicio: id_subtipo_servicio (
                nombre,
                id_tipo_servicio,
                tipo_servicio: id_tipo_servicio (nombre)
              ),
              servicio_medico (
                fecha_servicio,
                cita_medica (
                  paciente (
                    id_paciente
                  )
                )
              )
            `)
            .eq('servicio_medico.cita_medica.paciente.id_paciente', selectedProfile)
            .eq('estado', 'pendiente');


        if (error) throw error;

        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error al cargar las órdenes médicas');
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };

    fetchOrders();
  }, [selectedProfile]);

  // Obtener especialidades cuando se avanza al paso correspondiente
  useEffect(() => {
    if (step === 'specialty') {
      const fetchSpecialties = async () => {
        try {
          setLoading(prev => ({ ...prev, specialties: true }));

          // Primero obtenemos los subtipos de servicio que pertenecen a "Consulta Médica"
          const { data: serviciosData, error: serviciosError } = await supabase
              .from('tipo_servicio')
              .select(`
              nombre,
              subtipo_servicio!inner(
                id_subtipo_servicio,
                nombre
              )
            `)
              .eq('nombre', 'Consulta Médica');

          if (serviciosError) throw serviciosError;

          // Extraemos los nombres de los subtipos de servicio
          const specialties = serviciosData?.[0]?.subtipo_servicio?.map(st => ({
            id_especialidad: st.id_subtipo_servicio,
            descripcion: st.nombre
          })) || [];

          setSpecialties(specialties);
        } catch (err) {
          console.error('Error fetching specialties:', err);
          setError('Error al cargar las especialidades médicas');
        } finally {
          setLoading(prev => ({ ...prev, specialties: false }));
        }
      };

      fetchSpecialties();
    }
  }, [step]);

  // Obtener médicos cuando se selecciona una especialidad u orden
  useEffect(() => {
    if (step === 'doctor' && (selectedSpecialty || selectedOrder?.id_tipo_servicio)) {
      const fetchDoctors = async () => {
        try {
          setLoading(prev => ({ ...prev, doctors: true }));

          let query = supabase
              .from('personal_medico')
              .select(`
              id_personal_medico,
              id_persona,
              id_especialidad,
              persona: id_persona (prenombres, primer_apellido, segundo_apellido),
              especialidad: id_especialidad (descripcion),
              habilitado
            `)
              .eq('habilitado', true);

          if (selectedSpecialty) {
            query = query.eq('id_especialidad', selectedSpecialty.id_especialidad);
          } else if (selectedOrder) {
            // Aquí podríamos filtrar por tipo de servicio si hay una relación en la base de datos
            // Por ahora solo mostramos todos los médicos habilitados
          }

          const { data, error } = await query;

          if (error) throw error;

          setDoctors(data || []);
        } catch (err) {
          console.error('Error fetching doctors:', err);
          setError('Error al cargar los médicos disponibles');
        } finally {
          setLoading(prev => ({ ...prev, doctors: false }));
        }
      };

      fetchDoctors();
    }
  }, [step, selectedSpecialty, selectedOrder]);

  // Obtener horarios disponibles cuando se selecciona un médico y fecha
  useEffect(() => {
    if (step === 'datetime' && selectedDoctor && selectedDate) {
      const fetchAvailableTimes = async () => {
        try {
          setLoading(prev => ({ ...prev, times: true }));

          // Primero obtener los turnos del médico
          const { data: shifts, error: shiftsError } = await supabase
              .from('turno')
              .select('hora_inicio, hora_fin')
              .eq('id_personal_medico', selectedDoctor.id_personal_medico)
              .eq('dia_semana', selectedDate.getDay()); // 0=Domingo, 1=Lunes, etc.

          if (shiftsError) throw shiftsError;

          if (!shifts || shifts.length === 0) {
            setAvailableTimes([]);
            return;
          }

          // Obtener las citas ya programadas para ese médico en esa fecha
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const { data: appointments, error: appointmentsError } = await supabase
              .from('cita_medica')
              .select('servicio_medico (hora_inicio_servicio)')
              .eq('id_personal_medico', selectedDoctor.id_personal_medico)
              .eq('estado', 'programada')
              .eq('servicio_medico.fecha_servicio', formattedDate);

          if (appointmentsError) throw appointmentsError;

          // Generar horarios disponibles basados en los turnos y citas existentes
          const bookedTimes = appointments?.map(a => a.servicio_medico.hora_inicio_servicio) || [];
          const availableSlots: string[] = [];

          shifts.forEach(shift => {
            // Generar slots cada 30 minutos dentro del turno
            const start = new Date(`2000-01-01T${shift.hora_inicio}`);
            const end = new Date(`2000-01-01T${shift.hora_fin}`);

            let current = new Date(start);
            while (current < end) {
              const timeStr = current.toTimeString().substring(0, 5);
              if (!bookedTimes.includes(timeStr)) {
                const hour = current.getHours();
                const minutes = current.getMinutes().toString().padStart(2, '0');
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour;
                availableSlots.push(`${displayHour}:${minutes} ${ampm}`);
              }
              current = new Date(current.getTime() + 30 * 60000); // Añadir 30 minutos
            }
          });

          setAvailableTimes(availableSlots);
        } catch (err) {
          console.error('Error fetching available times:', err);
          setError('Error al cargar los horarios disponibles');
        } finally {
          setLoading(prev => ({ ...prev, times: false }));
        }
      };

      fetchAvailableTimes();
    }
  }, [step, selectedDoctor, selectedDate]);

  const handleSubmit = async () => {
    if (!selectedProfile || !selectedDoctor || !selectedDate || !selectedTime) {
      setError('Faltan datos para programar la cita');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));

      // Convertir la hora seleccionada al formato de la base de datos (HH:MM:SS)
      const [timePart, ampm] = selectedTime.split(' ');
      const [hours, minutes] = timePart.split(':');
      let hour = parseInt(hours, 10);
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes}:00`;

      // Crear fecha-hora combinada
      const dateTimeString = `${selectedDate.toISOString().split('T')[0]}T${timeString}`;

      // Crear la cita médica
      const { data: appointment, error: appointmentError } = await supabase
          .from('cita_medica')
          .insert({
            id_paciente: selectedProfile,
            id_personal_medico: selectedDoctor.id_personal_medico,
            estado: 'Programada',
            fecha_hora_programada: dateTimeString
          })
          .select()
          .single();

      if (appointmentError || !appointment) throw appointmentError || new Error('No se pudo crear la cita');

      // Si hay una orden médica seleccionada, vincularla
      if (selectedOrder) {
        const { error: orderError } = await supabase
            .from('cita_con_orden')
            .insert({
              id_orden: selectedOrder.id_orden,
              id_cita_medica: appointment.id_cita_medica
            });

        if (orderError) throw orderError;
      } else {
        // Si es cita sin orden, usar el subtipo de servicio de la especialidad
        const { error: noOrderError } = await supabase
            .from('cita_sin_orden')
            .insert({
              id_cita_medica: appointment.id_cita_medica,
              id_subtipo_servicio: selectedSpecialty?.id_especialidad
            });

        if (noOrderError) throw noOrderError;
      }

      onSuccess();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Error al programar la cita');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const renderStepContent = () => {
    if (error) {
      return (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600">{error}</p>
            <button
                onClick={() => setError(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
      );
    }

    switch (step) {
      case 'order':
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">Órdenes Médicas Disponibles</h2>
                <button
                    onClick={() => setStep('specialty')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Programar sin orden →
                </button>
              </div>

              {loading.orders ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
              ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                        <button
                            key={order.id_orden}
                            onClick={() => {
                              setSelectedOrder(order);
                              setStep('doctor');
                            }}
                            className="w-full p-4 border rounded-md text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                <h3 className="font-medium text-gray-800">{order.motivo}</h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Tipo: {order.subtipo_servicio.tipo_servicio.nombre} - {order.subtipo_servicio.nombre}
                              </p>
                              <p className="text-sm text-gray-500">
                                Fecha: {new Date(order.servicio_medico?.fecha_servicio).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                          </div>
                        </button>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No hay órdenes médicas pendientes</p>
                    <button
                        onClick={() => setStep('specialty')}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Programar consulta médica
                    </button>
                  </div>
              )}
            </div>
        );

      case 'specialty':
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                    onClick={() => setStep('order')}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  ← Volver
                </button>
                <h2 className="text-lg font-medium text-gray-800">Seleccione Especialidad</h2>
              </div>
              {loading.specialties ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {specialties.map(specialty => (
                        <button
                            key={specialty.id_especialidad}
                            onClick={() => {
                              setSelectedSpecialty(specialty);
                              setStep('doctor');
                            }}
                            className="p-4 border rounded-md text-left hover:bg-gray-50 transition-colors"
                        >
                          {specialty.descripcion}
                        </button>
                    ))}
                  </div>
              )}
            </div>
        );

      case 'doctor':
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                    onClick={() => setStep(selectedOrder ? 'order' : 'specialty')}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  ← Volver
                </button>
                <h2 className="text-lg font-medium text-gray-800">
                  Seleccione Médico - {selectedOrder ? selectedOrder.subtipo_servicio.tipo_servicio.nombre : selectedSpecialty?.descripcion}
                </h2>
              </div>
              {loading.doctors ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
              ) : doctors.length > 0 ? (
                  <div className="space-y-4">
                    {doctors.map(doctor => (
                        <button
                            key={doctor.id_personal_medico}
                            disabled={!doctor.habilitado}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setStep('datetime');
                            }}
                            className={`w-full p-4 border rounded-md text-left transition-colors ${
                                selectedDoctor?.id_personal_medico === doctor.id_personal_medico
                                    ? 'border-blue-500 bg-blue-50'
                                    : doctor.habilitado
                                        ? 'border-gray-200 hover:bg-gray-50'
                                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                        >
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="font-medium">
                                Dr. {doctor.persona.prenombres.split(' ')[0]} {doctor.persona.primer_apellido}
                              </p>
                              <p className="text-sm text-gray-500">
                                {doctor.especialidad.descripcion}
                              </p>
                            </div>
                          </div>
                        </button>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No hay médicos disponibles</p>
                    <button
                        onClick={() => setStep(selectedOrder ? 'order' : 'specialty')}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Volver atrás
                    </button>
                  </div>
              )}
            </div>
        );

      case 'datetime':
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                    onClick={() => setStep('doctor')}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  ← Volver
                </button>
                <h2 className="text-lg font-medium text-gray-800">Seleccione Fecha y Hora</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-4">Fecha</h3>
                  <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      minDate={new Date()}
                      className="w-full border rounded-md p-2"
                  />
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-4">Horarios Disponibles</h3>
                  {loading.times ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      </div>
                  ) : selectedDate ? (
                      availableTimes.length > 0 ? (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              {availableTimes.map(time => (
                                  <button
                                      key={time}
                                      onClick={() => setSelectedTime(time)}
                                      className={`p-3 border rounded-md transition-colors ${
                                          selectedTime === time
                                              ? 'border-blue-500 bg-blue-50'
                                              : 'border-gray-200 hover:bg-gray-50'
                                      }`}
                                  >
                                    {time}
                                  </button>
                              ))}
                            </div>

                            {selectedTime && (
                                <div className="mt-6 space-y-4">
                                  <div className="bg-gray-50 p-4 rounded-md">
                                    <h4 className="font-medium text-gray-800 mb-2">Resumen de la Cita</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <span className="text-gray-500">Paciente:</span>{' '}
                                        {currentProfile?.persona.prenombres} {currentProfile?.persona.primer_apellido} {currentProfile?.persona.segundo_apellido}
                                      </p>
                                      {selectedOrder ? (
                                          <>
                                            <p>
                                              <span className="text-gray-500">Orden:</span>{' '}
                                              {selectedOrder.motivo}
                                            </p>
                                            <p>
                                              <span className="text-gray-500">Tipo:</span>{' '}
                                              {selectedOrder.subtipo_servicio.tipo_servicio.nombre}
                                            </p>
                                          </>
                                      ) : (
                                          <p>
                                            <span className="text-gray-500">Especialidad:</span>{' '}
                                            {selectedSpecialty?.descripcion}
                                          </p>
                                      )}
                                      <p>
                                        <span className="text-gray-500">Médico:</span>{' '}
                                        Dr. {selectedDoctor?.persona.prenombres.split(' ')[0]} {selectedDoctor?.persona.primer_apellido}
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Fecha:</span>{' '}
                                        {selectedDate?.toLocaleDateString()}
                                      </p>
                                      <p>
                                        <span className="text-gray-500">Hora:</span>{' '}
                                        {selectedTime}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex space-x-3">
                                    <button
                                        onClick={onCancel}
                                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading.submit}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                      {loading.submit ? (
                                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                      ) : (
                                          'Confirmar Cita'
                                      )}
                                    </button>
                                  </div>
                                </div>
                            )}
                          </>
                      ) : (
                          <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Por favor seleccione otra fecha o médico
                            </p>
                          </div>
                      )
                  ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Seleccione una fecha para ver los horarios disponibles</p>
                      </div>
                  )}
                </div>
              </div>
            </div>
        );
    }
  };

  return renderStepContent();
};

export default Appointments;