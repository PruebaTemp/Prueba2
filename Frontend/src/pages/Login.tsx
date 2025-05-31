import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Eye, EyeOff, Camera } from 'lucide-react';
import FaceLogin from '../components/FaceLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Por favor complete todos los campos');
      }

      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ha ocurrido un error durante el inicio de sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    setShowBiometricPrompt(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometricPrompt(false);
    login('demo@example.com', 'password').then(() => {
      navigate('/');
    });
  };

  const handleBiometricCancel = () => {
    setShowBiometricPrompt(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <img src="/images/logo.png" alt="EsSalud" className="h-12" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">EsSalud</h2>
        <p className="text-center text-sm text-gray-600">Sistema de Gestión de Historias Clínicas</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-t-md"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-3 py-2 border rounded-b-md"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Recordarme</span>
            </label>
            <a href="#" className="text-essalud-blue hover:underline">¿Olvidó su contraseña?</a>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-essalud-blue text-white rounded hover:bg-essalud-light"
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>

            <button
              type="button"
              onClick={handleBiometricLogin}
              className="w-full py-2 px-4 border text-gray-700 bg-white rounded hover:bg-gray-50 flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Autenticación biométrica
            </button>
          </div>
        </form>
      </div>

      {/* Pantalla flotante FaceLogin */}
      {showBiometricPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-2xl shadow-xl w-full max-w-lg relative">
            <FaceLogin
              onSuccess={handleBiometricSuccess}
              onCancel={handleBiometricCancel}
            />
            <button
              onClick={handleBiometricCancel}
              className="absolute top-2 right-2 text-essalud-blue hover:text-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
