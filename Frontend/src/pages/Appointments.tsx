import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  X, 
  CheckCircle, 
  Plus,
  FileText
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Appointments: React.FC = () => {
  const { user } = useUser();
  const [view, setView] = useState<'list' | 'create'>('list');
  
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
        ? <PatientAppointmentsList onCreateNew={() => setView('create')} /> 
        : <CreateAppointment onCancel={() => setView('list')} onSuccess={() => setView('list')} />}
    </div>
  );
};

const PatientAppointmentsList: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => {
  const appointments = [
    { 
      id: '1', 
      doctor: 'Dr. María González', 
      specialty: 'Cardiología', 
      date: '15 Jun 2025', 
      time: '09:30 AM',
      location: 'Centro Médico Norte, Consultorio 302',
      status: 'scheduled'
    },
    { 
      id: '2', 
      doctor: 'Dr. Carlos Ruiz', 
      specialty: 'Oftalmología', 
      date: '22 Jun 2025', 
      time: '11:00 AM',
      location: 'Centro Médico Sur, Consultorio 105',
      status: 'scheduled'
    },
    { 
      id: '3', 
      doctor: 'Dra. Ana Martínez', 
      specialty: 'Dermatología', 
      date: '05 May 2025', 
      time: '10:15 AM',
      location: 'Centro Médico Norte, Consultorio 210',
      status: 'completed'
    },
  ];

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Próximas Citas</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{appointment.doctor}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                    <button className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors text-sm w-full md:w-auto">
                      Cancelar Cita
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm w-full md:w-auto">
                      Reprogramar
                    </button>
                  </div>
                </div>
              </div>
            ))
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
      
      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Historial de Citas</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pastAppointments.map(appointment => (
              <div key={appointment.id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{appointment.doctor}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-600">Completada</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CreateAppointment: React.FC<{ onCancel: () => void, onSuccess: () => void }> = ({ onCancel, onSuccess }) => {
  const { user } = useUser();
  const [step, setStep] = useState<'profile' | 'order' | 'specialty' | 'doctor' | 'datetime'>('profile');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  // Sample data
  const profiles = user?.profiles || [];
  const orders = user?.medicalOrders || [];
  
  const specialties = [
    'Cardiología', 'Dermatología', 'Endocrinología', 'Gastroenterología',
    'Neurología', 'Oftalmología', 'Oncología', 'Pediatría', 'Psiquiatría',
    'Traumatología', 'Urología'
  ];
  
  const doctors = [
    { id: '1', name: 'Dr. María González', specialty: 'Cardiología', available: true },
    { id: '2', name: 'Dr. Carlos Ruiz', specialty: 'Cardiología', available: true },
    { id: '3', name: 'Dra. Ana Martínez', specialty: 'Cardiología', available: false },
  ];
  
  const availableTimes = ['09:00 AM', '10:30 AM', '11:45 AM', '02:15 PM', '03:30 PM'];

  const handleSubmit = () => {
    onSuccess();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-6">Seleccione el Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => {
                    setSelectedProfile(profile.id);
                    setStep('order');
                  }}
                  className={`p-4 border rounded-md text-left transition-colors ${
                    selectedProfile === profile.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-gray-500">
                        {profile.isCurrentUser ? 'Titular' : 'Dependiente'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

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
            
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <button
                    key={order.id}
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
                          <h3 className="font-medium text-gray-800">{order.description}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Ordenado por: {order.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fecha: {order.orderDate}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'pending' ? 'Pendiente' : 
                         order.status === 'scheduled' ? 'Programada' : 'Completada'}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {specialties.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => {
                    setSelectedSpecialty(specialty);
                    setStep('doctor');
                  }}
                  className="p-4 border rounded-md text-left hover:bg-gray-50 transition-colors"
                >
                  {specialty}
                </button>
              ))}
            </div>
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
                Seleccione Médico - {selectedOrder ? selectedOrder.type : selectedSpecialty}
              </h2>
            </div>
            <div className="space-y-4">
              {doctors.map(doctor => (
                <button
                  key={doctor.id}
                  disabled={!doctor.available}
                  onClick={() => {
                    setSelectedDoctor(doctor.id);
                    setStep('datetime');
                  }}
                  className={`w-full p-4 border rounded-md text-left transition-colors ${
                    selectedDoctor === doctor.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : doctor.available
                        ? 'border-gray-200 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
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

                {selectedDate && selectedTime && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-800 mb-2">Resumen de la Cita</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Paciente:</span>{' '}
                          {profiles.find(p => p.id === selectedProfile)?.name}
                        </p>
                        {selectedOrder ? (
                          <>
                            <p>
                              <span className="text-gray-500">Orden:</span>{' '}
                              {selectedOrder.description}
                            </p>
                            <p>
                              <span className="text-gray-500">Tipo:</span>{' '}
                              {selectedOrder.type}
                            </p>
                          </>
                        ) : (
                          <p>
                            <span className="text-gray-500">Especialidad:</span>{' '}
                            {selectedSpecialty}
                          </p>
                        )}
                        <p>
                          <span className="text-gray-500">Médico:</span>{' '}
                          {doctors.find(d => d.id === selectedDoctor)?.name}
                        </p>
                        <p>
                          <span className="text-gray-500">Fecha:</span>{' '}
                          {selectedDate.toLocaleDateString()}
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
                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Confirmar Cita
                      </button>
                    </div>
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