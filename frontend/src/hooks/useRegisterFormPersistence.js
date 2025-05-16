import { useEffect } from "react";

export function useRegisterFormPersistence(setFormData, setStep) {
  useEffect(() => {
    // Solo restaurar si venimos de Términos o Políticas
    const fromLegal = localStorage.getItem('registerFromLegal');
    if (fromLegal) {
      const savedFormData = localStorage.getItem('registerFormData');
      const savedStep = localStorage.getItem('registerStep');
      if (savedFormData) setFormData(JSON.parse(savedFormData));
      if (savedStep) setStep(Number(savedStep));
      localStorage.removeItem('registerFromLegal');
    }
  }, [setFormData, setStep]);
}

export function saveRegisterFormToStorage(formData, step) {
  localStorage.setItem('registerFormData', JSON.stringify(formData));
  localStorage.setItem('registerStep', step);
  localStorage.setItem('registerFromLegal', 'true');
}