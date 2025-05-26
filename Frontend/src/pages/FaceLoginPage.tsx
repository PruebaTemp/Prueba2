import React from 'react';
import FaceLogin from '../components/FaceLogin';

const FaceLoginPage: React.FC = () => {
  return (
    <div>
      <h1>Ingreso con Reconocimiento Facial</h1>
      <FaceLogin />
    </div>
  );
};

export default FaceLoginPage;
