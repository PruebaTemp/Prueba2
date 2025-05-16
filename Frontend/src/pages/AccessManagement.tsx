import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  Search, 
  UserCog, 
  Check, 
  X, 
  Users, 
  UserPlus,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AccessManagement: React.FC = () => {
  const { user } = useUser();
  const [view, setView] = useState<'requests' | 'users'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  if (!user || user.currentRole !== 'admin') {
    return (
      <div className="container mx-auto text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acceso Restringido</h2>
        <p className="text-gray-600">
          Solo los asistentes administrativos pueden acceder a esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestión de Acceso</h1>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setView('requests')}
            className={`px-4 py-2 rounded-md ${
              view === 'requests' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Solicitudes
          </button>
          <button
            onClick={() => setView('users')}
            className={`px-4 py-2 rounded-md ${
              view === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Usuarios
          </button>
        </div>
      </div>

      {view === 'requests' ? (
        <AccessRequests 
          selectedRequest={selectedRequest} 
          setSelectedRequest={setSelectedRequest} 
        />
      ) : (
        <UserManagement />
      )}
    </div>
  );
};

interface AccessRequestsProps {
  selectedRequest: string | null;
  setSelectedRequest: (id: string | null) => void;
}

const AccessRequests: React.FC<AccessRequestsProps> = ({ selectedRequest, setSelectedRequest }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  
  // Sample access requests
  const accessRequests = [
    { 
      id: '1', 
      name: 'Laura Martínez', 
      type: 'Paciente', 
      document: '40582934', 
      email: 'laura.martinez@example.com',
      requestDate: '12 Jun 2025',
      status: 'pending'
    },
    { 
      id: '2', 
      name: 'Dr. Alberto Gómez', 
      type: 'Personal Médico', 
      document: '30125478', 
      email: 'alberto.gomez@hospital.com',
      requestDate: '11 Jun 2025',
      status: 'pending'
    },
    { 
      id: '3', 
      name: 'Sandra Vega', 
      type: 'Paciente', 
      document: '42587963', 
      email: 'sandra.vega@example.com',
      requestDate: '10 Jun 2025',
      status: 'approved'
    },
    { 
      id: '4', 
      name: 'Carlos López', 
      type: 'Asistente Administrativo', 
      document: '38456123', 
      email: 'carlos.lopez@hospital.com',
      requestDate: '09 Jun 2025',
      status: 'rejected'
    },
  ];

  // Filter requests based on status
  const filteredRequests = filter === 'all' 
    ? accessRequests 
    : accessRequests.filter(request => request.status === filter);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {selectedRequest ? (
        <RequestDetail 
          requestId={selectedRequest} 
          onBack={() => setSelectedRequest(null)} 
          request={accessRequests.find(r => r.id === selectedRequest)!}
        />
      ) : (
        <>
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h2 className="text-lg font-medium text-gray-800 mb-4 md:mb-0">
                Solicitudes de Acceso
              </h2>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar solicitud..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 text-sm ${
                      filter === 'all' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-2 text-sm ${
                      filter === 'pending' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Pendientes
                  </button>
                  <button
                    onClick={() => setFilter('approved')}
                    className={`px-3 py-2 text-sm ${
                      filter === 'approved' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Aprobadas
                  </button>
                  <button
                    onClick={() => setFilter('rejected')}
                    className={`px-3 py-2 text-sm ${
                      filter === 'rejected' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Rechazadas
                  </button>
                </div>
              </div>
            </div>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-npm run dev text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserCog className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{request.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.document}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.requestDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'pending' 
                            ? 'Pendiente' 
                            : request.status === 'approved'
                            ? 'Aprobada'
                            : 'Rechazada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setSelectedRequest(request.id)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Ver
                        </button>
                        
                        {request.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-800 mr-3">
                              Aprobar
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              Rechazar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <UserCog className="h-12 w-12 text-gray-400 mb-3" />
                        <p>No hay solicitudes {filter !== 'all' ? `con estado "${filter}"` : ''}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

interface RequestDetailProps {
  requestId: string;
  onBack: () => void;
  request: any;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ requestId, onBack, request }) => {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  
  const handleApprove = () => {
    setShowApprovalForm(true);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="mr-1">←</span> Volver
        </button>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{request.name}</h2>
          <p className="text-gray-600">Solicitud de Acceso #{requestId}</p>
        </div>
        <span className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full ${
          request.status === 'pending' 
            ? 'bg-yellow-100 text-yellow-800' 
            : request.status === 'approved'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {request.status === 'pending' 
            ? 'Pendiente' 
            : request.status === 'approved'
            ? 'Aprobada'
            : 'Rechazada'}
        </span>
      </div>
      
      {!showApprovalForm ? (
        <>
          {/* Request Information */}
          <div className="bg-gray-50 p-6 rounded-md mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Información del Solicitante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre Completo</p>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Usuario</p>
                <p className="font-medium">{request.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Documento</p>
                <p className="font-medium">{request.document}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium">{request.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                <p className="font-medium">{request.requestDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Motivo de Solicitud</p>
                <p className="font-medium">Acceso a mi historial médico personal</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleApprove}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Check className="h-5 w-5 mr-2" />
                Aprobar Solicitud
              </button>
              <button
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <X className="h-5 w-5 mr-2" />
                Rechazar Solicitud
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Aprobación de Solicitud
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Está a punto de aprobar el acceso para {request.name}. Complete la información a continuación para configurar la cuenta.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Usuario para el inicio de sesión"
                  defaultValue={request.email.split('@')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Temporal
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contraseña inicial"
                  defaultValue="Temp1234!"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roles Asignados
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="role-patient"
                    checked={request.type === 'Paciente'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="role-patient" className="ml-2 block text-sm text-gray-900">
                    Paciente
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="role-medical"
                    checked={request.type === 'Personal Médico'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="role-medical" className="ml-2 block text-sm text-gray-900">
                    Personal Médico
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="role-admin"
                    checked={request.type === 'Asistente Administrativo'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-900">
                    Asistente Administrativo
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Información adicional sobre la aprobación..."
              ></textarea>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Información Importante
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Una vez aprobada la solicitud, el sistema enviará un correo electrónico automático al usuario con sus credenciales e instrucciones para acceder al sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowApprovalForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Confirmar Aprobación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample users
  const users = [
    { 
      id: '1', 
      name: 'Juan Pérez', 
      email: 'juan.perez@example.com',
      document: '35421678',
      roles: ['Paciente'],
      status: 'active',
      lastLogin: '15 Jun 2025'
    },
    { 
      id: '2', 
      name: 'Dra. María González', 
      email: 'maria.gonzalez@hospital.com',
      document: '28456123',
      roles: ['Personal Médico'],
      status: 'active',
      lastLogin: '14 Jun 2025'
    },
    { 
      id: '3', 
      name: 'Carlos Rodríguez', 
      email: 'carlos.rodriguez@hospital.com',
      document: '32159487',
      roles: ['Asistente Administrativo', 'Paciente'],
      status: 'active',
      lastLogin: '13 Jun 2025'
    },
    { 
      id: '4', 
      name: 'Sandra Vega', 
      email: 'sandra.vega@example.com',
      document: '42587963',
      roles: ['Paciente'],
      status: 'inactive',
      lastLogin: '01 May 2025'
    },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.document.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h2 className="text-lg font-medium text-gray-800 mb-4 md:mb-0">
            Gestión de Usuarios
          </h2>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <UserPlus size={18} className="mr-2" />
              Crear Usuario
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acceso
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.document}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            role === 'Paciente' 
                              ? 'bg-blue-100 text-blue-800' 
                              : role === 'Personal Médico'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      {user.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-400 mb-3" />
                    <p>No se encontraron usuarios</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessManagement;