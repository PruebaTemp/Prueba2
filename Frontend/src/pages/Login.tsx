import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Eye, EyeOff, Camera } from 'lucide-react';

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
    setTimeout(() => {
      setShowBiometricPrompt(false);
      login('demo@example.com', 'password').then(() => {
        navigate('/');
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img 
              src="/images/logo.png" 
              alt="EsSalud" 
              className="h-12"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            EsSalud
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Gestión de Historias Clínicas
          </p>
        </div>
        
        {showBiometricPrompt ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Camera size={64} className="text-essalud-blue animate-pulse" />
                    <div className="absolute inset-0 border-2 border-essalud-light rounded-full animate-ping"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium">Autenticación Biométrica</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Por favor, posiciónese frente a la cámara para la verificación facial
                </p>
                <div className="mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowBiometricPrompt(false)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Correo electrónico
                </label>
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
              </div>
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
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

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
                <a href="#" className="font-medium text-essalud-blue hover:text-essalud-light">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-essalud-blue hover:bg-essalud-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-essalud-blue ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
              
              <button
                type="button"
                onClick={handleBiometricLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-essalud-blue"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Camera className="h-5 w-5 text-gray-500 group-hover:text-gray-400" />
                </span>
                Autenticación biométrica
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;