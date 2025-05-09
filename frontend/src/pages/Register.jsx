import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import FormContainer from '../components/FormContainer';

const Register = () => {
  const navigate = useNavigate(); // Para redirección
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    console.log('Datos enviados:', formData);
    navigate('/iniciar-sesion'); // Redirigir al inicio de sesión
  };

  return (
    <FormContainer>
      {step === 1 ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">Registrar cuenta</h1>
          <p className="text-gray-400 text-center mb-6">
            ¿Ya estás registrado?{' '}
            <Link to="/iniciar-sesion" className="text-purple-500 hover:underline">
              Iniciar sesión
            </Link>
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
          <Button onClick={() => setStep(2)}>Siguiente</Button>
        </>
      ) : (
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
          <div className="flex justify-between">
            <Button onClick={() => setStep(1)}>Atrás</Button>
            <Button onClick={handleSubmit} type="submit">
              Registrar
            </Button>
          </div>
        </>
      )}
    </FormContainer>
  );
};

export default Register;