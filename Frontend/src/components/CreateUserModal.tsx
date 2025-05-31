import React, { useState } from 'react';
import RegisterFace from './RegisterFace';

type Props = {
  onClose: () => void;
};

const CreateUserModal: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Paciente');
  const [step, setStep] = useState<'form' | 'face'>('form');

  const handleContinueToFace = () => {
    if (!name || !document || !email) return;
    setStep('face');
  };

  const handleFaceSuccess = () => {
    // Aquí podrías guardar el nuevo usuario en el backend (simulado)
    onClose();
    alert(`✅ Usuario "${name}" registrado correctamente con rostro.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-6">
      {step === 'form' ? (
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nuevo Usuario</h2>

          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Documento de identidad"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="w-full mb-3 border rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 border rounded px-3 py-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-4 border rounded px-3 py-2"
          >
            <option value="Paciente">Paciente</option>
            <option value="Personal Médico">Personal Médico</option>
            <option value="Asistente Administrativo">Asistente Administrativo</option>
          </select>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={handleContinueToFace}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Continuar con rostro
            </button>
          </div>
        </div>
      ) : (
        <RegisterFace username={name} onSuccess={handleFaceSuccess} onCancel={onClose} />
      )}
    </div>
  );
};

export default CreateUserModal;
