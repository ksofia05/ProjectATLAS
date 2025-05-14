import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import FormContainer from '../components/FormContainer';
import PasswordValidator from '../components/componentsFunctionalities/passwordValidation';
import PasswordInput from '../components/PasswordInput';
import AnimatedContainer from '../components/AnimatedContainer'; // Importar el nuevo componente

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

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
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
    <AnimatedContainer keyProp={step}>
      <FormContainer>
        {step === 1 && (
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
              icon="bi-person-fill"
            />
            <Input
              label="Apellidos"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              icon="bi-person-fill"
            />
            <Input
              label="Correo"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon="bi-envelope-fill"
            />
            <Button onClick={handleNext}>Siguiente</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">Registrar cuenta</h1>
            <p className="text-gray-400 text-center mb-6">¡Casi listo! Continúa con la creación de tu contraseña.</p>
            <PasswordInput
              label="Crear Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              errorMessage={formData.password && formData.password.length < 8 ? 'La contraseña es muy corta' : ''}
            />

            <PasswordValidator password={formData.password} />

            <PasswordInput
              label="Confirmar Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              errorMessage={
                formData.confirmPassword && formData.confirmPassword !== formData.password
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
            />

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
            <div className="flex justify-between space-x-8">
              <Button onClick={handleBack}>Atrás</Button>
              <Button onClick={handleSubmit} type="submit">
                Registrar
              </Button>
            </div>
          </>
        )}
      </FormContainer>
    </AnimatedContainer>
  );
};

export default Register;