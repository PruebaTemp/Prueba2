import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Calendar, FileText, AlertCircle, Users, Stethoscope, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Different dashboard content based on role
  const renderDashboardContent = () => {
    switch (user.currentRole) {
      case 'patient':
        return <PatientDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'medical':
        return <MedicalDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {getGreeting()}, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenido al Sistema de Gestión de Historias Clínicas
        </p>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

const PatientDashboard: React.FC = () => {
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. María González', specialty: 'Cardiología', date: '15 Jun 2025', time: '09:30 AM' },
    { id: 2, doctor: 'Dr. Carlos Ruiz', specialty: 'Oftalmología', date: '22 Jun 2025', time: '11:00 AM' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Upcoming Appointments */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Próximas Citas</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver todas
          </button>
        </div>
        
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{appointment.date}</p>
                    <p className="text-xs text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p>No tienes citas programadas</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Programar una cita
            </button>
          </div>
        )}
      </div>

      {/* Recent Medical Records */}
      <div className="col-span-1 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Historial Reciente</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver todo
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Stethoscope className="h-5 w-5 text-green-600 mr-2" />
                <p className="font-medium text-gray-800">Consulta General</p>
              </div>
              <span className="text-xs text-gray-500">10 May 2025</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Dr. Fernando Méndez</p>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <p className="font-medium text-gray-800">Análisis de Sangre</p>
              </div>
              <span className="text-xs text-gray-500">28 Abr 2025</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Lab. Central</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <button className="bg-white p-4 rounded-lg shadow-sm flex items-center hover:bg-blue-50 transition-colors">
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <span className="ml-3 font-medium text-gray-800">Programar Cita</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow-sm flex items-center hover:bg-green-50 transition-colors">
          <div className="p-3 bg-green-100 rounded-full">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <span className="ml-3 font-medium text-gray-800">Ver Historia Clínica</span>
        </button>
        
        <button className="bg-white p-4 rounded-lg shadow-sm flex items-center hover:bg-purple-50 transition-colors">
          <div className="p-3 bg-purple-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-purple-600" />
          </div>
          <span className="ml-3 font-medium text-gray-800">Solicitar Ayuda</span>
        </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const pendingAccessRequests = [
    { id: 1, name: 'Laura Martínez', type: 'Paciente', document: '40582934', requestDate: '12 Jun 2025' },
    { id: 2, name: 'Dr. Alberto Gómez', type: 'Personal Médico', document: '30125478', requestDate: '11 Jun 2025' },
    { id: 3, name: 'Sandra Vega', type: 'Paciente', document: '42587963', requestDate: '10 Jun 2025' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Access Requests */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Solicitudes de Acceso Pendientes</h2>
          <span className="inline-flex items-center justify-center text-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {pendingAccessRequests.length} nuevas
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingAccessRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-left text-sm text-gray-500">{request.document}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-left text-sm text-gray-500">{request.requestDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-800 mr-3">
                      Aprobar
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas para Administradores */}
      <div className="col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Estadísticas</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Solicitudes de Acceso</span>
                <span className="text-sm font-medium text-gray-700">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Usuarios Activos</span>
                <span className="text-sm font-medium text-gray-700">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Historias Actualizadas</span>
                <span className="text-sm font-medium text-gray-700">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Acciones Rápidas</h2>
          
          <div className="space-y-3">
            <Link
                to='/access-management'
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Gestionar Usuarios
            </Link>

            <Link
                to='/medical-records'
                className="w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Historias Clínicas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicalDashboard: React.FC = () => {
  const todayAppointments = [
    { id: 1, patient: 'Carlos Sánchez', time: '09:00 AM', status: 'completed' },
    { id: 2, patient: 'Ana García', time: '10:30 AM', status: 'in-progress' },
    { id: 3, patient: 'Miguel López', time: '11:45 AM', status: 'pending' },
    { id: 4, patient: 'Lucía Fernández', time: '14:15 PM', status: 'pending' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Today's Schedule */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Agenda de Hoy</h2>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        <div className="space-y-4">
          {todayAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`flex items-center justify-between p-4 rounded-md ${
                appointment.status === 'completed' 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : appointment.status === 'in-progress'
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'bg-gray-50 border-l-4 border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-sm font-medium">{appointment.time}</div>
                </div>
                <div>
                  <div className="font-medium">{appointment.patient}</div>
                  <div className="text-sm text-gray-500">
                    {appointment.status === 'completed' 
                      ? 'Completada' 
                      : appointment.status === 'in-progress'
                      ? 'En progreso'
                      : 'Pendiente'}
                  </div>
                </div>
              </div>
              <div>
                <button 
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    appointment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : appointment.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-white text-blue-600 border border-blue-600'
                  }`}
                >
                  {appointment.status === 'completed' 
                    ? 'Ver detalles' 
                    : appointment.status === 'in-progress'
                    ? 'Continuar'
                    : 'Iniciar atención'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions and Stats */}
      <div className="col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Acciones Rápidas</h2>
          
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
              <FileText className="h-5 w-5 mr-2" />
              Registrar Servicio Médico
            </button>
            
            <button className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Nueva Consulta
            </button>
            
            <button className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Ver Historial de Paciente
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Resumen del Día</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-blue-700">4</div>
              <div className="text-sm text-blue-700">Citas programadas</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-green-700">1</div>
              <div className="text-sm text-green-700">Completadas</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-yellow-700">1</div>
              <div className="text-sm text-yellow-700">En progreso</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-gray-700">2</div>
              <div className="text-sm text-gray-700">Pendientes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;