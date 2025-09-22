import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FormContainer from "../../components/common/FormContainer";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Checkbox from "../../components/common/Checkbox";
import Button from "../../components/common/Button";
import PasswordValidator from "../../components/functionalities/passwordValidation";
import {
  useRegisterFormPersistence,
  saveRegisterFormToStorage,
} from "../../hooks/useRegisterFormPersistence";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
} from "../../components/common/popUp/Loading";
import { toast } from "react-hot-toast";
import { client } from "../../supabase/client";
import { API_BASE } from "../../api/apiBase";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/dashboard-create-project";

  useRegisterFormPersistence(setFormData, setStep);

  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isStep2SubmitDisabled, setIsStep2SubmitDisabled] = useState(true); // Nuevo estado para paso 2
  const [isValidating, setIsValidating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (name === "firstName") {
      if (!value) error = "El nombre es requerido";
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value))
        error = "El nombre solo debe contener letras";
    }
    if (name === "lastName") {
      if (!value) error = "El apellido es requerido";
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value))
        error = "El apellido solo debe contener letras";
    }
    if (name === "email") {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!value) {
        error = "El correo electrónico es requerido";
      } else if (!emailRegex.test(value)) {
        error = "Correo electrónico inválido";
      }
    }
    return error;
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    console.log("handleChange ejecutado:", { name, value, type, checked }); // Debug

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    const error = validateField(name, type === "checkbox" ? checked : value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Nueva función para validar contraseña
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(password); 

    console.log("validatePassword debug:", {
      password,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    });

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  useEffect(() => {
    const isFilled = formData.firstName && formData.lastName && formData.email;
    const firstNameError = validateField("firstName", formData.firstName);
    const lastNameError = validateField("lastName", formData.lastName);
    const emailError = validateField("email", formData.email);
    const hasLocalErrors = !!(firstNameError || lastNameError || emailError);
    const hasBackendEmailError = !!errors.email;
    setIsSubmitDisabled(
      !(isFilled && !hasLocalErrors && !hasBackendEmailError)
    );
  }, [formData.firstName, formData.lastName, formData.email, errors]);

  // Nuevo useEffect para el paso 2
  useEffect(() => {
    if (step === 2) {
      const isPasswordValid = validatePassword(formData.password);
      const doPasswordsMatch = formData.password === formData.confirmPassword;
      const passwordsNotEmpty =
        formData.password !== "" && formData.confirmPassword !== "";
      const areTermsAccepted = formData.termsAccepted;

      console.log("Validación paso 2:", {
        isPasswordValid,
        doPasswordsMatch,
        passwordsNotEmpty,
        areTermsAccepted,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: formData.termsAccepted,
      });

      setIsStep2SubmitDisabled(
        !(
          isPasswordValid &&
          doPasswordsMatch &&
          passwordsNotEmpty &&
          areTermsAccepted
        )
      );
    }
  }, [
    formData.password,
    formData.confirmPassword,
    formData.termsAccepted,
    step,
  ]);

  const handleBack = () => setStep(1);

  const handleNext = async () => {
    const newErrors = {};
    ["firstName", "lastName", "email"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsValidating(true);
      const toastId = showLoadingToast("Verificando correo...");

      try {
        const response = await fetch(
          `${API_BASE}tasks/api/v1/verificar-correo/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          }
        );

        const data = await response.json();
        toast.dismiss(toastId);

        if (data.exists) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Este correo ya está registrado.",
          }));
        } else {
          setStep(2);
        }
      } catch (error) {
        toast.dismiss(toastId);
        console.error("Error al verificar el correo:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Error al verificar el correo. Intenta nuevamente.",
        }));
      } finally {
        setIsValidating(false); // Siempre se desbloquea aquí ;(
      }
    } else {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      showErrorToast("Debes aceptar los\ntérminos y condiciones.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showErrorToast("Las contraseñas no coinciden.");
      return;
    }

    if (step === 2) {
      setIsRegistering(true);
      const toastId = showLoadingToast("Registrando...");

      try {
        // registrar en Supabase Auth
        const { data: authData, error: authError } = await client.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nombre: formData.firstName,
              apellido: formData.lastName,
            },
          },
        });

        if (authError) {
          toast.dismiss(toastId);
          if (authError.message.includes("User already registered")) {
            showErrorToast("Este correo ya está registrado.");
            setStep(1);
            setErrors((prev) => ({
              ...prev,
              email: "Este correo ya está registrado.",
            }));
          } else {
            showErrorToast(authError.message || "Error al registrar.");
          }
          return;
        }

        // guardar en tabla Usuario
        if (authData.user) {
          const { data: userData, error: dbError } = await client
            .from("Usuario")
            .insert([
              {
                uuid_supabase: authData.user.id,
                auth_user_id: authData.user.id,
                nombre: formData.firstName,
                apellido: formData.lastName,
                correoElectronico: formData.email,
                estado: "Activo",
                suscripcion: "Gratuito",
                terminoServicio: "TRUE",
              },
            ])
            .select()
            .single();

          if (dbError) {
            toast.dismiss(toastId);
            console.error("Error al guardar en tabla Usuario:", dbError);
            showErrorToast(
              "Error al completar el registro en la base de datos."
            );
            return;
          }

          await client.auth.updateUser({
            data: { usuario_db_id: userData.id },
          });
        }

        // Limpiar localStorage
        localStorage.removeItem("registerFormData");
        localStorage.removeItem("registerStep");

        if (authData.session) {
          client.auth.signOut();
        }

        if (next && next.startsWith("/dashboard/")) {
          const idProyecto = next.split("/dashboard/")[1];
          try {
            await fetch(
              `${API_BASE}tasks/api/v1/asociar_colaborador/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_proyecto: idProyecto,
                  email: formData.email,
                }),
              }
            );
          } catch (err) {
            showErrorToast("Error al asociar colaborador al proyecto.");
          }
        }

        // Redirige al login
        let loginUrl = `/iniciar-sesion?next=${encodeURIComponent(next)}`;
        const idProyectoParam = params.get("id_proyecto");
        if (idProyectoParam) loginUrl += `&id_proyecto=${idProyectoParam}`;

        toast.dismiss(toastId);
        showSuccessToast("¡Cuenta creada! Ahora puedes iniciar sesión.");
        navigate(loginUrl);
      } catch (err) {
        toast.dismiss(toastId);
        showErrorToast("Error inesperado al registrar.");
        console.error("Error en registro:", err);
      } finally {
        setIsRegistering(false); // Siempre se desbloquea aquí
      }
    }
  };

  return (
    <FormContainer>
      {step === 1 ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            Registrar cuenta
          </h1>
          <p className="text-gray-400 text-center mb-6">
            ¿Ya estás registrado?{" "}
            <Link
              to="/iniciar-sesion"
              className="text-purple-500 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
          <Input
            label="Nombres"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            errorMessage={errors.firstName}
            icon={"bi-person-fill"}
          />
          <Input
            label="Apellidos"
            type="text"
            name="lastName"
            value={formData.lastName}
            errorMessage={errors.lastName}
            onChange={handleChange}
            icon={"bi-person-fill"}
          />
          <Input
            label="Correo"
            type="email"
            name="email"
            value={formData.email}
            errorMessage={errors.email}
            onChange={handleChange}
            icon={"bi-envelope-fill"}
          />
          <Button
            onClick={handleNext}
            disabled={isSubmitDisabled || isValidating}
            className={`${
              isSubmitDisabled || isValidating
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Siguiente
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">
            Registrar cuenta
          </h1>
          <p className="text-gray-400 text-center mb-6">
            ¡Casi listo! Continúa con la creación de tu contraseña.
          </p>
          <PasswordInput
            label="Crear Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordValidator password={formData.password} />
          <PasswordInput
            label="Confirmar Contraseña"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            errorMessage={
              formData.confirmPassword &&
              formData.confirmPassword !== formData.password
                ? "Las contraseñas no coinciden"
                : ""
            }
          />
          <Checkbox
            label={
              <>
                Acepto los{" "}
                <Link
                  to="/terminos"
                  state={{ from: "/registrarse" }}
                  className="text-purple-500 hover:underline"
                  onClick={() => saveRegisterFormToStorage(formData, step)}
                >
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link
                  to="/politica-de-privacidad"
                  state={{ from: "/registrarse" }}
                  className="text-purple-500 hover:underline"
                  onClick={() => saveRegisterFormToStorage(formData, step)}
                >
                  Políticas de Privacidad
                </Link>
              </>
            }
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          <div className="flex justify-between space-x-8">
            <Button onClick={handleBack} disabled={isRegistering}>
              Atrás
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              disabled={isStep2SubmitDisabled || isRegistering} // Aqui usa el nuevo perro estado :/
              className={`${
                isStep2SubmitDisabled || isRegistering
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Registrar
            </Button>
          </div>
        </>
      )}
    </FormContainer>
  );
};

export default Register;
