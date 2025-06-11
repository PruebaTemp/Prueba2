import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { supabase } from '../lib/supabase';

type Props = {
  username: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const RegisterFace: React.FC<Props> = ({ username, onSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar modelos y encender cámara
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };
    loadModels();

    return () => stopVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    });
  };

  const stopVideo = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleRegister = async () => {
    setMessage('');
    setLoading(true);
    
    try {
      if (!videoRef.current) {
        throw new Error('Video no inicializado');
      }

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No se detectó ningún rostro. Intenta de nuevo.');
      }

      const descriptor = Array.from(detection.descriptor);

      // Guardar descriptor en Supabase
      const { error } = await supabase
        .from('facial_descriptors')
        .insert([{
          user_id: username, // Usamos el email como ID
          descriptor,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setMessage('✅ Rostro registrado con éxito');
      
      if (onSuccess) {
        setTimeout(() => {
          stopVideo();
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 p-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-xl text-center relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Registrar rostro para: <span className="text-blue-600">{username}</span>
        </h2>

        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto max-h-[480px] rounded-lg border border-gray-300 mx-auto"
        />

        <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </>
            ) : (
              'Registrar Rostro'
            )}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded shadow disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
        </div>

        {message && (
          <p className={`mt-4 text-sm font-medium ${
            message.includes('✅') ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterFace;