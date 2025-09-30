import React from "react";

const PasswordValidationIndicator = ({ password }) => {
  if (!password) return null;

  const validations = [
    {
      test: password.length >= 8,
      message: "Mínimo 8 caracteres",
    },
    {
      test: /[A-Z]/.test(password),
      message: "Al menos una letra mayúscula",
    },
    {
      test: /[a-z]/.test(password),
      message: "Al menos una letra minúscula",
    },
    {
      test: /[0-9]/.test(password),
      message: "Al menos un número",
    },
    {
      test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      message: "Al menos un carácter especial",
    },
  ];

  return (
    <div className="mt-4 space-y-1">
      {validations.map((validation, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              validation.test ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          <span className={validation.test ? "text-green-400" : "text-red-400"}>
            {validation.message}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidationIndicator;
