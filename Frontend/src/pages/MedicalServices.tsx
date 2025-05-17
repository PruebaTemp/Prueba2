import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import {
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  Plus,
  X,
  Save,
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Thermometer,
  Clipboard,
  FileCheck,
  Pill,
  Syringe,
  Bed,
  Scissors,
  CheckCircle,
  AlertCircle,
  User,
  FileSearch
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MedicalAttention {
  id: string;
  type: 'triage' | 'exam' | 'diagnosis' | 'hospitalization' | 'treatment';
  date: string;
  details: Record<string, any>;
  doctor: string;
}

interface MedicalOrder {
  id: string;
  type: 'exam' | 'surgery' | 'therapy' | 'consultation';
  date: string;
  description: string;
  status: 'pending' | 'completed';
  details?: Record<string, any>;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed';
  reason: string;
}

const MedicalServices: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState<'exam' | 'surgery' | 'therapy' | 'consultation' | null>(null);
  const [showAttentionForm, setShowAttentionForm] = useState(false);
  const [attentionType, setAttentionType] = useState<'triage' | 'exam' | 'diagnosis' | 'hospitalization' | 'treatment' | null>(null);
  const [treatmentType, setTreatmentType] = useState<'medication' | 'therapy' | 'surgery' | null>(null);
  const [attentions, setAttentions] = useState<MedicalAttention[]>([]);
  const [orders, setOrders] = useState<MedicalOrder[]>([]);
  const [isAttentionCompleted, setIsAttentionCompleted] = useState(false);

  // Estados para formularios
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    weight: '',
    height: '',
    oxygenSaturation: ''
  });

  const [examData, setExamData] = useState({
    reason: '',
    physicalExam: '',
    observations: ''
  });

  const [diagnosisData, setDiagnosisData] = useState({
    symptoms: [] as string[],
    newSymptom: '',
    selectedDiseases: [] as string[],
    observations: ''
  });

  const [hospitalizationData, setHospitalizationData] = useState({
    reason: '',
    service: '',
    responsibleDoctor: '',
    bedNumber: '',
    initialObservations: ''
  });

  const [treatmentData, setTreatmentData] = useState({
    medication: {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    },
    therapy: {
      type: '',
      sessions: '',
      goals: ''
    },
    surgery: {
      type: '',
      specialty: '',
      urgency: 'programada',
      procedure: '',
      preOpInstructions: ''
    }
  });

  if (!user) return null;

  // Datos de ejemplo
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Carlos Sánchez',
      patientId: '1',
      date: '2025-06-15',
      time: '09:00',
      status: 'pending',
      reason: 'Control mensual'
    },
    {
      id: '2',
      patientName: 'Ana García',
      patientId: '2',
      date: '2025-06-15',
      time: '10:30',
      status: 'pending',
      reason: 'Dolor de espalda'
    }
  ];

  const diseases = [
    { code: 'J00', name: 'Rinofaringitis aguda [resfriado común]' },
    { code: 'J02.9', name: 'Faringitis aguda, no especificada' },
    { code: 'M54.5', name: 'Lumbago no especificado' },
  ];

  const medicalServices = [
    { value: 'laboratory', label: 'Laboratorio Clínico' },
    { value: 'radiology', label: 'Radiología' },
    { value: 'ultrasound', label: 'Ecografía' },
    { value: 'cardiology', label: 'Cardiología' }
  ];

  const specialties = [
    { value: 'general', label: 'Medicina General' },
    { value: 'cardiology', label: 'Cardiología' },
    { value: 'neurology', label: 'Neurología' },
    { value: 'orthopedics', label: 'Traumatología' }
  ];

  // Handlers
  const handleStartAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsAttentionCompleted(false);
    setAttentions([]);
    setOrders([]);
  };

  const handleSaveAttention = () => {
    if (!attentionType) return;

    const now = new Date().toLocaleString();
    const doctorName = `${user.firstName} ${user.lastName}`;

    let attentionDetails: Record<string, any> = {};

    switch (attentionType) {
      case 'triage':
        attentionDetails = { ...vitalSigns };
        break;
      case 'exam':
        attentionDetails = { ...examData };
        break;
      case 'diagnosis':
        attentionDetails = {
          symptoms: diagnosisData.symptoms,
          diseases: diagnosisData.selectedDiseases,
          observations: diagnosisData.observations
        };
        break;
      case 'hospitalization':
        attentionDetails = { ...hospitalizationData };
        break;
      case 'treatment':
        attentionDetails = { type: treatmentType, ...treatmentData };
        break;
    }

    const newAttention: MedicalAttention = {
      id: `att-${Date.now()}`,
      type: attentionType,
      date: now,
      details: attentionDetails,
      doctor: doctorName
    };

    setAttentions([...attentions, newAttention]);
    setShowAttentionForm(false);
    setAttentionType(null);
    setTreatmentType(null);
  };

  const handleCreateOrder = () => {
    if (!orderType) return;

    const now = new Date().toLocaleString();
    const orderDetails: Record<string, any> = {};

    // Aquí podrías agregar detalles específicos para cada tipo de orden

    const newOrder: MedicalOrder = {
      id: `ord-${Date.now()}`,
      type: orderType,
      date: now,
      description: `Orden de ${orderType}`,
      status: 'pending',
      details: orderDetails
    };

    setOrders([...orders, newOrder]);
    setShowOrderForm(false);
    setOrderType(null);
  };

  const handleCompleteAttention = () => {
    setIsAttentionCompleted(true);
    // Aquí iría la lógica para guardar todo en el backend
  };

  const handleViewMedicalRecord = () => {
    const patientId = appointments.find(a => a.id === selectedAppointment)?.patientId;
    if (patientId) {
      navigate(`/medical-records?patientId=${patientId}&fromAppointment=${selectedAppointment}`);
    }
  };

  const handleAddSymptom = () => {
    if (diagnosisData.newSymptom.trim()) {
      setDiagnosisData({
        ...diagnosisData,
        symptoms: [...diagnosisData.symptoms, diagnosisData.newSymptom.trim()],
        newSymptom: ''
      });
    }
  };

  const handleToggleDisease = (code: string) => {
    setDiagnosisData({
      ...diagnosisData,
      selectedDiseases: diagnosisData.selectedDiseases.includes(code)
          ? diagnosisData.selectedDiseases.filter(c => c !== code)
          : [...diagnosisData.selectedDiseases, code]
    });
  };

  const currentAppointment = selectedAppointment
      ? appointments.find(a => a.id === selectedAppointment)
      : null;

  // Render functions
  const renderAttentionForm = () => {
    switch (attentionType) {
      case 'triage':
        return (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Registro de Triaje</h3>
                <button
                    onClick={() => setAttentionType(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperatura (°C)
                  </label>
                  <input
                      type="number"
                      step="0.1"
                      value={vitalSigns.temperature}
                      onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presión Arterial (mmHg)
                  </label>
                  <div className="flex space-x-2">
                    <input
                        type="number"
                        value={vitalSigns.bloodPressure.systolic}
                        onChange={(e) => setVitalSigns({
                          ...vitalSigns,
                          bloodPressure: {...vitalSigns.bloodPressure, systolic: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="120"
                    />
                    <span className="flex items-center">/</span>
                    <input
                        type="number"
                        value={vitalSigns.bloodPressure.diastolic}
                        onChange={(e) => setVitalSigns({
                          ...vitalSigns,
                          bloodPressure: {...vitalSigns.bloodPressure, diastolic: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="80"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia Cardíaca (lpm)
                  </label>
                  <input
                      type="number"
                      value={vitalSigns.heartRate}
                      onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                      type="number"
                      step="0.1"
                      value={vitalSigns.weight}
                      onChange={(e) => setVitalSigns({...vitalSigns, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="70.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talla (cm)
                  </label>
                  <input
                      type="number"
                      value={vitalSigns.height}
                      onChange={(e) => setVitalSigns({...vitalSigns, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saturación O2 (%)
                  </label>
                  <input
                      type="number"
                      value={vitalSigns.oxygenSaturation}
                      onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="98"
                  />
                </div>
              </div>
            </div>
        );

      case 'exam':
        return (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Examen Médico</h3>
                <button
                    onClick={() => setAttentionType(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de Consulta
                </label>
                <textarea
                    rows={3}
                    value={examData.reason}
                    onChange={(e) => setExamData({...examData, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción del motivo de consulta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Examen Físico
                </label>
                <textarea
                    rows={4}
                    value={examData.physicalExam}
                    onChange={(e) => setExamData({...examData, physicalExam: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hallazgos del examen físico..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                    rows={3}
                    value={examData.observations}
                    onChange={(e) => setExamData({...examData, observations: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
        );

      case 'diagnosis':
        return (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Registro de Diagnóstico</h3>
                <button
                    onClick={() => setAttentionType(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Síntomas
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                        type="text"
                        value={diagnosisData.newSymptom}
                        onChange={(e) => setDiagnosisData({
                          ...diagnosisData,
                          newSymptom: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese un síntoma..."
                    />
                    <button
                        onClick={handleAddSymptom}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                  {diagnosisData.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {diagnosisData.symptoms.map((symptom, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                        {symptom}
                              <button
                                  onClick={() => setDiagnosisData({
                                    ...diagnosisData,
                                    symptoms: diagnosisData.symptoms.filter((_, i) => i !== index)
                                  })}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                          ×
                        </button>
                      </span>
                        ))}
                      </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Morbilidades (CIE-10)
                </label>
                <div className="mt-2 space-y-2">
                  {diseases.map(disease => (
                      <label key={disease.code} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={diagnosisData.selectedDiseases.includes(disease.code)}
                            onChange={() => handleToggleDisease(disease.code)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-900">
                      {disease.code} - {disease.name}
                    </span>
                      </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                    rows={4}
                    value={diagnosisData.observations}
                    onChange={(e) => setDiagnosisData({
                      ...diagnosisData,
                      observations: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
        );

      case 'hospitalization':
        return (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">Registro de Hospitalización</h3>
                <button
                    onClick={() => setAttentionType(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de Hospitalización
                  </label>
                  <textarea
                      rows={3}
                      value={hospitalizationData.reason}
                      onChange={(e) => setHospitalizationData({
                        ...hospitalizationData,
                        reason: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describa el motivo de la hospitalización..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servicio/Área
                  </label>
                  <select
                      value={hospitalizationData.service}
                      onChange={(e) => setHospitalizationData({
                        ...hospitalizationData,
                        service: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar servicio</option>
                    <option value="medicina-interna">Medicina Interna</option>
                    <option value="cirugia">Cirugía</option>
                    <option value="pediatria">Pediatría</option>
                    <option value="ginecologia">Ginecología</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Médico Responsable
                  </label>
                  <input
                      type="text"
                      value={hospitalizationData.responsibleDoctor}
                      onChange={(e) => setHospitalizationData({
                        ...hospitalizationData,
                        responsibleDoctor: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre del médico responsable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cama
                  </label>
                  <input
                      type="text"
                      value={hospitalizationData.bedNumber}
                      onChange={(e) => setHospitalizationData({
                        ...hospitalizationData,
                        bedNumber: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: H301-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones Iniciales
                </label>
                <textarea
                    rows={4}
                    value={hospitalizationData.initialObservations}
                    onChange={(e) => setHospitalizationData({
                      ...hospitalizationData,
                      initialObservations: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Observaciones y notas iniciales..."
                />
              </div>
            </div>
        );

      case 'treatment':
        if (!treatmentType) {
          return (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800">Seleccionar Tipo de Tratamiento</h3>
                  <button
                      onClick={() => setAttentionType(null)}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                      onClick={() => setTreatmentType('medication')}
                      className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center mb-3">
                      <Pill className="h-8 w-8 text-blue-600 mr-3" />
                      <h4 className="text-lg font-medium">Medicamentos</h4>
                    </div>
                    <p className="text-gray-600">
                      Prescripción de medicamentos.
                    </p>
                  </button>

                  <button
                      onClick={() => setTreatmentType('therapy')}
                      className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center mb-3">
                      <Activity className="h-8 w-8 text-green-600 mr-3" />
                      <h4 className="text-lg font-medium">Terapia</h4>
                    </div>
                    <p className="text-gray-600">
                      Terapia física o rehabilitación.
                    </p>
                  </button>

                  <button
                      onClick={() => setTreatmentType('surgery')}
                      className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center mb-3">
                      <Scissors className="h-8 w-8 text-red-600 mr-3" />
                      <h4 className="text-lg font-medium">Intervención Quirúrgica</h4>
                    </div>
                    <p className="text-gray-600">
                      Procedimientos quirúrgicos.
                    </p>
                  </button>
                </div>
              </div>
          );
        }

        return (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">
                  {treatmentType === 'medication' && 'Prescripción de Medicamentos'}
                  {treatmentType === 'therapy' && 'Prescripción de Terapia'}
                  {treatmentType === 'surgery' && 'Programación de Cirugía'}
                </h3>
                <button
                    onClick={() => setTreatmentType(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {treatmentType === 'medication' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medicamento
                        </label>
                        <input
                            type="text"
                            value={treatmentData.medication.name}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              medication: {
                                ...treatmentData.medication,
                                name: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre del medicamento"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosis
                        </label>
                        <input
                            type="text"
                            value={treatmentData.medication.dosage}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              medication: {
                                ...treatmentData.medication,
                                dosage: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frecuencia
                        </label>
                        <input
                            type="text"
                            value={treatmentData.medication.frequency}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              medication: {
                                ...treatmentData.medication,
                                frequency: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Cada 8 horas"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duración
                        </label>
                        <input
                            type="text"
                            value={treatmentData.medication.duration}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              medication: {
                                ...treatmentData.medication,
                                duration: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 7 días"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instrucciones Especiales
                      </label>
                      <textarea
                          rows={3}
                          value={treatmentData.medication.instructions}
                          onChange={(e) => setTreatmentData({
                            ...treatmentData,
                            medication: {
                              ...treatmentData.medication,
                              instructions: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Instrucciones adicionales para el paciente..."
                      />
                    </div>
                  </>
              )}

              {treatmentType === 'therapy' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Terapia
                        </label>
                        <select
                            value={treatmentData.therapy.type}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              therapy: {
                                ...treatmentData.therapy,
                                type: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccionar tipo</option>
                          <option value="fisica">Terapia Física</option>
                          <option value="ocupacional">Terapia Ocupacional</option>
                          <option value="lenguaje">Terapia del Lenguaje</option>
                          <option value="respiratoria">Terapia Respiratoria</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Sesiones
                        </label>
                        <input
                            type="number"
                            value={treatmentData.therapy.sessions}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              therapy: {
                                ...treatmentData.therapy,
                                sessions: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objetivos de la Terapia
                      </label>
                      <textarea
                          rows={4}
                          value={treatmentData.therapy.goals}
                          onChange={(e) => setTreatmentData({
                            ...treatmentData,
                            therapy: {
                              ...treatmentData.therapy,
                              goals: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describa los objetivos de la terapia..."
                      />
                    </div>
                  </>
              )}

              {treatmentType === 'surgery' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Cirugía
                        </label>
                        <input
                            type="text"
                            value={treatmentData.surgery.type}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              surgery: {
                                ...treatmentData.surgery,
                                type: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre del procedimiento"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialidad
                        </label>
                        <select
                            value={treatmentData.surgery.specialty}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              surgery: {
                                ...treatmentData.surgery,
                                specialty: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccionar especialidad</option>
                          <option value="general">Cirugía General</option>
                          <option value="orthopedics">Traumatología</option>
                          <option value="ophthalmology">Oftalmología</option>
                          <option value="cardiology">Cirugía Cardiovascular</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Urgencia
                        </label>
                        <select
                            value={treatmentData.surgery.urgency}
                            onChange={(e) => setTreatmentData({
                              ...treatmentData,
                              surgery: {
                                ...treatmentData.surgery,
                                urgency: e.target.value as 'programada' | 'urgente'
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="programada">Programada</option>
                          <option value="urgente">Urgente</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción del Procedimiento
                      </label>
                      <textarea
                          rows={4}
                          value={treatmentData.surgery.procedure}
                          onChange={(e) => setTreatmentData({
                            ...treatmentData,
                            surgery: {
                              ...treatmentData.surgery,
                              procedure: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describa el procedimiento quirúrgico..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instrucciones Preoperatorias
                      </label>
                      <textarea
                          rows={3}
                          value={treatmentData.surgery.preOpInstructions}
                          onChange={(e) => setTreatmentData({
                            ...treatmentData,
                            surgery: {
                              ...treatmentData.surgery,
                              preOpInstructions: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Instrucciones para el paciente..."
                      />
                    </div>
                  </>
              )}
            </div>
        );

      default:
        return (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Seleccionar Tipo de Atención
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => setAttentionType('triage')}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center mb-3">
                    <Thermometer className="h-8 w-8 text-blue-600 mr-3" />
                    <h4 className="text-lg font-medium">Triaje</h4>
                  </div>
                  <p className="text-gray-600">
                    Registro de signos vitales y evaluación inicial.
                  </p>
                </button>

                <button
                    onClick={() => setAttentionType('exam')}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center mb-3">
                    <Clipboard className="h-8 w-8 text-green-600 mr-3" />
                    <h4 className="text-lg font-medium">Examen Médico</h4>
                  </div>
                  <p className="text-gray-600">
                    Evaluación física y registro de hallazgos.
                  </p>
                </button>

                <button
                    onClick={() => setAttentionType('diagnosis')}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center mb-3">
                    <Stethoscope className="h-8 w-8 text-purple-600 mr-3" />
                    <h4 className="text-lg font-medium">Diagnóstico</h4>
                  </div>
                  <p className="text-gray-600">
                    Registro de diagnóstico y plan de tratamiento.
                  </p>
                </button>

                <button
                    onClick={() => setAttentionType('hospitalization')}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center mb-3">
                    <Bed className="h-8 w-8 text-red-600 mr-3" />
                    <h4 className="text-lg font-medium">Hospitalización</h4>
                  </div>
                  <p className="text-gray-600">
                    Registro de ingreso hospitalario.
                  </p>
                </button>

                <button
                    onClick={() => setAttentionType('treatment')}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center mb-3">
                    <Pill className="h-8 w-8 text-orange-600 mr-3" />
                    <h4 className="text-lg font-medium">Tratamiento</h4>
                  </div>
                  <p className="text-gray-600">
                    Registro de medicamentos y procedimientos.
                  </p>
                </button>
              </div>
            </div>
        );
    }
  };

  const renderOrderForm = () => {
    if (!orderType) {
      return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Seleccionar Tipo de Orden
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                  onClick={() => setOrderType('exam')}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <Activity className="h-8 w-8 text-blue-600 mr-3" />
                  <h4 className="text-lg font-medium">Examen Médico</h4>
                </div>
                <p className="text-gray-600">
                  Solicitar exámenes de laboratorio, radiografías, ecografías, etc.
                </p>
              </button>

              <button
                  onClick={() => setOrderType('surgery')}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <Heart className="h-8 w-8 text-red-600 mr-3" />
                  <h4 className="text-lg font-medium">Intervención Quirúrgica</h4>
                </div>
                <p className="text-gray-600">
                  Programar cirugías y procedimientos quirúrgicos.
                </p>
              </button>

              <button
                  onClick={() => setOrderType('therapy')}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <Brain className="h-8 w-8 text-green-600 mr-3" />
                  <h4 className="text-lg font-medium">Terapia</h4>
                </div>
                <p className="text-gray-600">
                  Solicitar terapia física, ocupacional, del lenguaje, etc.
                </p>
              </button>

              <button
                  onClick={() => setOrderType('consultation')}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <Stethoscope className="h-8 w-8 text-purple-600 mr-3" />
                  <h4 className="text-lg font-medium">Consulta Especializada</h4>
                </div>
                <p className="text-gray-600">
                  Derivar a consulta con un especialista.
                </p>
              </button>
            </div>
          </div>
      );
    }

    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">
              {orderType === 'exam' && 'Orden de Examen Médico'}
              {orderType === 'surgery' && 'Orden de Intervención Quirúrgica'}
              {orderType === 'therapy' && 'Orden de Terapia'}
              {orderType === 'consultation' && 'Orden de Consulta Especializada'}
            </h3>
            <button
                onClick={() => setOrderType(null)}
                className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {orderType === 'exam' && 'Exámenes solicitados'}
              {orderType === 'surgery' && 'Tipo de procedimiento'}
              {orderType === 'therapy' && 'Tipo de terapia'}
              {orderType === 'consultation' && 'Especialidad'}
            </label>
            {orderType === 'exam' ? (
                <div className="space-y-2">
                  {medicalServices.map((service) => (
                      <label key={service.value} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-900">{service.label}</span>
                      </label>
                  ))}
                </div>
            ) : orderType === 'consultation' ? (
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Seleccionar especialidad</option>
                  {specialties.map((specialty) => (
                      <option key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </option>
                  ))}
                </select>
            ) : (
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      orderType === 'surgery'
                          ? 'Describa el procedimiento quirúrgico...'
                          : 'Describa el tipo de terapia requerida...'
                    }
                />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción detallada
            </label>
            <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  orderType === 'exam'
                      ? 'Detallar los exámenes requeridos...'
                      : orderType === 'surgery'
                          ? 'Describir el procedimiento quirúrgico...'
                          : orderType === 'therapy'
                              ? 'Especificar el tipo de terapia y objetivo...'
                              : 'Describir el motivo de la consulta...'
                }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrucciones/Preparación
            </label>
            <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Instrucciones específicas para el paciente..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnóstico relacionado
            </label>
            <textarea
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Diagnóstico que justifica la orden..."
            />
          </div>
        </div>
    );
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Servicios Médicos</h1>
        </div>

        {selectedAppointment ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                  <div className="flex-1">
                    <button
                        onClick={() => {
                          setSelectedAppointment(null);
                          setShowOrderForm(false);
                          setOrderType(null);
                          setShowAttentionForm(false);
                          setAttentionType(null);
                          setTreatmentType(null);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                      <span className="mr-1">←</span> Volver a citas
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {currentAppointment?.patientName}
                        </h2>
                        <p className="text-gray-600">{currentAppointment?.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones principales */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {!showOrderForm && !showAttentionForm && (
                        <>
                          <button
                              onClick={handleViewMedicalRecord}
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <FileText size={18} className="mr-2" />
                            Historia Clínica
                          </button>
                          <button
                              onClick={() => setShowAttentionForm(true)}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                          >
                            <FileCheck size={18} className="mr-2" />
                            Registrar Atención
                          </button>
                          <button
                              onClick={() => setShowOrderForm(true)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Plus size={18} className="mr-2" />
                            Generar Orden
                          </button>
                        </>
                    )}
                  </div>
                </div>

                {/* Formularios */}
                {showAttentionForm && (
                    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                      {renderAttentionForm()}
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setShowAttentionForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                            onClick={handleSaveAttention}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Save size={18} className="mr-2" />
                          Guardar Atención
                        </button>
                      </div>
                    </div>
                )}

                {showOrderForm && (
                    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                      {renderOrderForm()}
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setShowOrderForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                            onClick={handleCreateOrder}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Save size={18} className="mr-2" />
                          Generar Orden
                        </button>
                      </div>
                    </div>
                )}

                {/* Contenido principal */}
                <div className="space-y-8">
                  {/* Detalles de la cita */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Detalles de la Cita</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="font-medium">{currentAppointment?.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hora</p>
                        <p className="font-medium">{currentAppointment?.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium capitalize">{currentAppointment?.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Atenciones registradas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <Clipboard className="h-5 w-5 text-blue-600 mr-2" />
                        Atenciones Registradas
                      </h3>
                      <span className="text-sm text-gray-500">
                    {attentions.length} registros
                  </span>
                    </div>
                    {attentions.length > 0 ? (
                        <div className="space-y-3">
                          {attentions.map((attention) => (
                              <div key={attention.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-800 capitalize">
                                      {attention.type === 'triage' && 'Triaje'}
                                      {attention.type === 'exam' && 'Examen Médico'}
                                      {attention.type === 'diagnosis' && 'Diagnóstico'}
                                      {attention.type === 'hospitalization' && 'Hospitalización'}
                                      {attention.type === 'treatment' && 'Tratamiento'}
                                    </h4>
                                    <p className="text-sm text-gray-600">{attention.date}</p>
                                  </div>
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Completado
                          </span>
                                </div>

                                {/* Mostrar detalles específicos según el tipo de atención */}
                                {attention.type === 'triage' && (
                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                      <div>
                                        <span className="text-gray-500">Temp: </span>
                                        <span>{attention.details.temperature || '--'} °C</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">PA: </span>
                                        <span>
                                {attention.details.bloodPressure?.systolic || '--'}/
                                          {attention.details.bloodPressure?.diastolic || '--'} mmHg
                              </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">FC: </span>
                                        <span>{attention.details.heartRate || '--'} lpm</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Peso: </span>
                                        <span>{attention.details.weight || '--'} kg</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Talla: </span>
                                        <span>{attention.details.height || '--'} cm</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Sat O2: </span>
                                        <span>{attention.details.oxygenSaturation || '--'}%</span>
                                      </div>
                                    </div>
                                )}

                                {attention.type === 'diagnosis' && attention.details.symptoms?.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Síntomas:</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {attention.details.symptoms.map((symptom: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {symptom}
                                </span>
                                        ))}
                                      </div>
                                    </div>
                                )}

                                {attention.type === 'treatment' && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Tipo: </p>
                                      <span className="text-sm capitalize">
                              {attention.details.type === 'medication' && 'Medicación'}
                                        {attention.details.type === 'therapy' && 'Terapia'}
                                        {attention.details.type === 'surgery' && 'Cirugía'}
                            </span>
                                    </div>
                                )}

                                <p className="text-sm text-gray-500 mt-2">Médico: {attention.doctor}</p>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                          <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p>No se han registrado atenciones aún</p>
                          <button
                              onClick={() => setShowAttentionForm(true)}
                              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Registrar primera atención
                          </button>
                        </div>
                    )}
                  </div>

                  {/* Órdenes generadas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        Órdenes Generadas
                      </h3>
                      <span className="text-sm text-gray-500">
                    {orders.length} registros
                  </span>
                    </div>
                    {orders.length > 0 ? (
                        <div className="space-y-3">
                          {orders.map((order) => (
                              <div key={order.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-800 capitalize">
                                      {order.type === 'exam' && 'Examen Médico'}
                                      {order.type === 'surgery' && 'Intervención Quirúrgica'}
                                      {order.type === 'therapy' && 'Terapia'}
                                      {order.type === 'consultation' && 'Consulta Especializada'}
                                    </h4>
                                    <p className="text-sm text-gray-600">{order.date}</p>
                                  </div>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                      order.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-green-100 text-green-800'
                                  }`}>
                            {order.status === 'pending' ? 'Pendiente' : 'Completado'}
                          </span>
                                </div>
                                <p className="text-sm mt-2">{order.description}</p>
                                {order.details && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      {/* Mostrar detalles específicos de la orden si existen */}
                                    </div>
                                )}
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                          <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p>No se han generado órdenes aún</p>
                          <button
                              onClick={() => setShowOrderForm(true)}
                              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Generar primera orden
                          </button>
                        </div>
                    )}
                  </div>

                  {/* Botón para concluir atención */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={handleCompleteAttention}
                        disabled={attentions.length === 0 || isAttentionCompleted}
                        className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                            isAttentionCompleted
                                ? 'bg-green-600 hover:bg-green-700'
                                : attentions.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                        } transition-colors`}
                    >
                      {isAttentionCompleted ? (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Atención Completada
                          </>
                      ) : (
                          'Concluir Atención'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        ) : (
            /* Lista de citas */
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                  <h2 className="text-lg font-medium text-gray-800">Citas del Día</h2>
                  <div className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.map((appointment) => (
                          <div
                              key={appointment.id}
                              className="flex items-center justify-between p-4 rounded-md bg-gray-50 border-l-4 border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Clock className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{appointment.patientName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <span>{appointment.time}</span>
                                  <span>•</span>
                                  <span>{appointment.reason}</span>
                                </div>
                              </div>
                            </div>
                            <button
                                onClick={() => handleStartAppointment(appointment.id)}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              Iniciar atención
                            </button>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No hay citas programadas para hoy</p>
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default MedicalServices;
