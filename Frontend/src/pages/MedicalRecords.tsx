import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  Search, 
  FileText, 
  Download, 
  Filter, 
  ChevronRight, 
  Calendar, 
  Pill, 
  Clipboard,
  Stethoscope
} from 'lucide-react';

const MedicalRecords: React.FC = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  
  if (!user) return null;
  
  // Sample records - in a real app this would come from an API
  const records = [
    { id: '1', patientName: 'Juan Pérez', lastUpdate: '15 May 2025', status: 'active' },
    { id: '2', patientName: 'Martina Pérez', lastUpdate: '10 Abr 2025', status: 'active' },
    { id: '3', patientName: 'Mateo Pérez', lastUpdate: '22 Mar 2025', status: 'active' },
  ];

  // Filter records based on search term
  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get content based on role
  let content: React.ReactNode = null;
  
  switch (user.currentRole) {
    case 'patient':
      content = <PatientMedicalRecords records={filteredRecords} selectedRecord={selectedRecord} setSelectedRecord={setSelectedRecord} />;
      break;
    case 'admin':
      content = <AdminMedicalRecords records={filteredRecords} />;
      break;
    case 'medical':
      content = <MedicalPersonnelRecords records={filteredRecords} selectedRecord={selectedRecord} setSelectedRecord={setSelectedRecord} />;
      break;
    default:
      content = <PatientMedicalRecords records={filteredRecords} selectedRecord={selectedRecord} setSelectedRecord={setSelectedRecord} />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Historias Clínicas</h1>
        
        <div className="relative flex items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar historia clínica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {content}
    </div>
  );
};

interface RecordProps {
  records: any[];
  selectedRecord?: string | null;
  setSelectedRecord?: (id: string | null) => void;
}

const PatientMedicalRecords: React.FC<RecordProps> = ({ records, selectedRecord, setSelectedRecord }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {selectedRecord ? (
        <MedicalRecordDetail recordId={selectedRecord} onBack={() => setSelectedRecord?.(null)} />
      ) : (
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Mis Historias Clínicas</h2>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
              <Filter size={16} className="mr-1" />
              Filtrar
            </button>
          </div>
          
          <div className="space-y-4">
            {records.length > 0 ? (
              records.map((record) => (
                <div 
                  key={record.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedRecord?.(record.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-800">{record.patientName}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Última actualización: {record.lastUpdate}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>No se encontraron historias clínicas</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminMedicalRecords: React.FC<RecordProps> = ({ records }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
          <h2 className="text-lg font-medium text-gray-800 mb-2 md:mb-0">Administración de Historias Clínicas</h2>
          <div className="space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              <Filter size={16} className="inline mr-1" />
              Filtrar
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              + Crear Nueva
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Paciente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{record.patientName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">40582934</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.lastUpdate}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-center inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      Editar
                    </button>
                    <button className="text-green-600 hover:text-green-800 mr-3">
                      Ver
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Archivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MedicalPersonnelRecords: React.FC<RecordProps> = ({ records, selectedRecord, setSelectedRecord }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {selectedRecord ? (
        <MedicalRecordDetail recordId={selectedRecord} onBack={() => setSelectedRecord?.(null)} showTreatmentOptions={true} />
      ) : (
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Historias Clínicas de Pacientes</h2>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
              <Filter size={16} className="mr-1" />
              Filtrar
            </button>
          </div>
          
          <div className="space-y-4">
            {records.length > 0 ? (
              records.map((record) => (
                <div 
                  key={record.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedRecord?.(record.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-800">{record.patientName}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">DNI: 40582934 • Última actualización: {record.lastUpdate}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>No se encontraron historias clínicas</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailProps {
  recordId: string;
  onBack: () => void;
  showTreatmentOptions?: boolean;
}

const MedicalRecordDetail: React.FC<DetailProps> = ({ recordId, onBack, showTreatmentOptions = false }) => {
  // For demo, we'll use hardcoded data
  const patientInfo = {
    name: 'Juan Pérez',
    id: recordId,
    birthDate: '15/04/1985',
    gender: 'Masculino',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Polen'],
  };
  
  const medicalHistory = [
    {
      id: '1',
      date: '12/05/2025',
      type: 'Consulta General',
      doctor: 'Dr. Fernando Méndez',
      diagnosis: 'Resfriado común',
      symptoms: ['Fiebre leve', 'Dolor de garganta', 'Congestión nasal'],
      treatment: 'Paracetamol 500mg cada 8 horas por 3 días',
    },
    {
      id: '2',
      date: '28/04/2025',
      type: 'Análisis de Sangre',
      doctor: 'Lab. Central',
      diagnosis: 'Valores normales',
      symptoms: [],
      treatment: 'Ninguno requerido',
    },
    {
      id: '3',
      date: '15/03/2025',
      type: 'Consulta Cardiología',
      doctor: 'Dra. María González',
      diagnosis: 'Hipertensión leve',
      symptoms: ['Presión arterial elevada'],
      treatment: 'Dieta baja en sodio, ejercicio regular',
    },
  ];

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
          <h2 className="text-2xl font-semibold text-gray-800">{patientInfo.name}</h2>
          <p className="text-gray-600">Historia Clínica #{patientInfo.id}</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Download size={16} className="mr-2" />
            Descargar
          </button>
          {showTreatmentOptions && (
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Stethoscope size={16} className="mr-2" />
              Registrar Servicio
            </button>
          )}
        </div>
      </div>
      
      {/* Patient Information */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Información del Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
            <p className="font-medium">{patientInfo.birthDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Género</p>
            <p className="font-medium">{patientInfo.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grupo Sanguíneo</p>
            <p className="font-medium">{patientInfo.bloodType}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-gray-500">Alergias</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {patientInfo.allergies.map((allergy, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Medical History */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Historial Médico</h3>
        
        <div className="space-y-4">
          {medicalHistory.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    {entry.type === 'Consulta General' || entry.type === 'Consulta Cardiología' ? (
                      <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
                    ) : (
                      <Clipboard className="h-5 w-5 text-green-600 mr-2" />
                    )}
                    <h4 className="font-medium text-gray-800">{entry.type}</h4>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {entry.date}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {entry.doctor}
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-medium">Diagnóstico:</p>
                <p className="text-sm">{entry.diagnosis}</p>
              </div>
              
              {entry.symptoms.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Síntomas:</p>
                  <ul className="text-sm list-disc list-inside">
                    {entry.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-2">
                <p className="text-sm font-medium">Tratamiento:</p>
                <div className="flex items-start mt-1">
                  <Pill className="h-4 w-4 mr-2 mt-1 text-purple-600" />
                  <p className="text-sm">{entry.treatment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;