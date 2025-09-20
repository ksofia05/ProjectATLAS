
import React from 'react';

const PasswordValidator = ({ password }) => {
  const lengthValid = password.length >= 8;
  const upperCase = /[A-Z]/.test(password);
  const lowerCase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const special=/[!@#$%^&*()_\-=\[\]{};':"\\|,+.<>\/?]/.test(password);

  const getClass = (condition) => {
    if (condition) return 'text-green-600';
    return 'text-red-500';
  };

  return (
    <div className="text-sm text-gray-600 mt-2 space-y-1">
      <p className={getClass(lengthValid)}>• Al menos 8 caracteres</p>
      <p className={getClass(upperCase)}>• Al menos una letra mayúscula</p>
      <p className={getClass(lowerCase)}>• Al menos una letra minúscula</p>
      <p className={getClass(number)}>• Al menos un número</p>
      <p className={getClass(special)}>• Al menos un carácter especial</p>
    </div>
  );
};

export default PasswordValidator;
