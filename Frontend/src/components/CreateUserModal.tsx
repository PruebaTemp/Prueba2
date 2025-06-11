import React, { useState } from 'react';
import RegisterFace from './RegisterFace';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';

type Props = {
  onClose: () => void;
};

const CreateUserModal: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Paciente');
  const [step, setStep] = useState<'form' | 'face'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleContinueToFace = async () => {
    if (!name || !document || !email) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tempPassword = generateTempPassword();
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email,
          password: tempPassword,
          name,
          document,
          role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear usuario');
      }

      setStep('face');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFaceSuccess = () => {
    onClose();
    // Aquí podrías mostrar una notificación de éxito
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-6">
      {step === 'form' ? (
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nuevo Usuario</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez López"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documento de identidad</label>
              <input
                type="text"
                placeholder="Ej: 87654321"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="Ej: usuario@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Paciente">Paciente</option>
                <option value="Personal Médico">Personal Médico</option>
                <option value="Asistente Administrativo">Asistente Administrativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleContinueToFace}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Continuar con rostro'
              )}
            </button>
          </div>
        </div>
      ) : (
        <RegisterFace 
          username={email} 
          onSuccess={handleFaceSuccess} 
          onCancel={() => {
            setStep('form');
            onClose();
          }} 
        />
      )}
    </div>
  );
};

export default CreateUserModal;