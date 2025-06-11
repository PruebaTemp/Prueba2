import { Camera, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceLogin from '../components/FaceLogin';
import { useUser } from '../contexts/UserContext';

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

      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        navigate('/');
      } else {
        throw new Error('Credenciales incorrectas'); // <- en caso login devuelva false
      }
    } catch (err: any) {
      // 👇 Aquí se captura y se muestra el mensaje de error
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    setShowBiometricPrompt(true);
  };

  const handleBiometricSuccess = async () => {
    setShowBiometricPrompt(false);
    try {
      navigate('/face-login');
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      setError('Error en la autenticación biométrica');
    }
  };

  const handleBiometricCancel = () => {
    setShowBiometricPrompt(false);
  };

  return (
    <div className="bg-essalud-bgLogin min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img
              src="/images/logo.png"
              alt="EsSalud"
              className="h-16 mt-1 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
          <h2 className="mt-0 mb-2 text-center text-3xl font-extrabold text-gray-900">
            EsSalud
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestión de Historias Clínicas
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-essalud-blue focus:border-essalud-blue focus:z-10 sm:text-sm"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-essalud-blue focus:border-essalud-blue focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-essalud-blue focus:ring-essalud-light border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-essalud-blue hover:text-essalud-orange">
                ¿Olvidó su contraseña?
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-essalud-blue hover:bg-essalud-hoverBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-essalud-blue ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <button
              type="button"
              onClick={handleBiometricLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-essalud-blue"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Camera className="h-5 w-5 text-gray-500 group-hover:text-gray-400" />
              </span>
              Autenticación biométrica
            </button>
          </div>
        </form>
      </div>

      {/* Modal FaceLogin */}
      {showBiometricPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-2xl shadow-xl w-full max-w-lg relative">
            <FaceLogin onSuccess={handleBiometricSuccess} onCancel={handleBiometricCancel} />
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