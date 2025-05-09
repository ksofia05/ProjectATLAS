import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import FormContainer from '../components/FormContainer';


const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
  };

  return (
    <FormContainer>
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">Registrar cuenta</h1>
          <p className="text-gray-400 text-center mb-6">
            ¿Ya estás registrado?{' '}
            <a href="/iniciar-sesion" className="text-purple-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
          <Input
            label="Nombres"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            icon="👤"
          />
          <Input
            label="Apellidos"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            icon="👤"
          />
          <Input
            label="Correo"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon="📧"
          />
          <Button onClick={handleNext}>Siguiente</Button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">Registrar cuenta</h1>
          <p className="text-gray-400 text-center mb-6">¡Casi listo! Continúa con la creación de tu contraseña.</p>
          <Input
            label="Crear Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon="👁️"
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon="👁️"
          />
          <p className="text-sm text-gray-400 mb-4">
            <span className="text-purple-500">•</span> Al menos 8 caracteres{' '}
            <span className="text-purple-500">•</span> Al menos un número
          </p>
          <Checkbox
            label={
              <>
                Acepto los{' '}
                <Link to="/terminos" className="text-purple-500 hover:underline">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link to="/politica-de-privacidad" className="text-purple-500 hover:underline">
                  Políticas de Privacidad
                </Link>
              </>
            }
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} type="submit">
            Registrar
          </Button>
        </>
      )}
    </FormContainer>
  );
};

export default Register;