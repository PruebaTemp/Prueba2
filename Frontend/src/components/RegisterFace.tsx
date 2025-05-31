import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

type Props = {
  username: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const RegisterFace: React.FC<Props> = ({ username, onSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [message, setMessage] = useState('');

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

    return () => stopVideo(); // ✅ apagar cámara al desmontar
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
    if (!username) {
      setMessage('⚠️ El nombre de usuario es requerido.');
      return;
    }

    const detection = await faceapi
      .detectSingleFace(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMessage('❌ No se detectó ningún rostro. Intenta de nuevo.');
      return;
    }

    const descriptor = detection.descriptor;

    // Guardar rostro en localStorage
    const stored = localStorage.getItem('registeredFaces');
    const registered = stored ? JSON.parse(stored) : [];

    registered.push({
      label: username,
      descriptors: Array.from(descriptor),
    });

    localStorage.setItem('registeredFaces', JSON.stringify(registered));
    setMessage(`✅ Rostro de "${username}" registrado con éxito.`);

    // Ejecutar onSuccess si viene del modal
    if (onSuccess) {
      setTimeout(() => {
        stopVideo();
        onSuccess();
      }, 2000);
    }
  };

  const handleCancel = () => {
    stopVideo();
    if (onCancel) onCancel();
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
          className="w-[640px] h-[480px] rounded-lg border border-gray-300 mx-auto"
        />

        <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={handleRegister}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow"
          >
            Registrar Rostro
          </button>
          {onCancel && (
            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded shadow"
            >
              Cancelar
            </button>
          )}
        </div>

        {message && (
          <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterFace;

