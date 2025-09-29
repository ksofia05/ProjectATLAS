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
  const exp = params.get("exp");
  const next = params.get("next") || "/dashboard-create-project";

  useRegisterFormPersistence(setFormData, setStep);

  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isStep2SubmitDisabled, setIsStep2SubmitDisabled] = useState(true);
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

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&+*(),.?":{}|<>_-]/.test(password);

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

  useEffect(() => {
    if (step === 2) {
      const isPasswordValid = validatePassword(formData.password);
      const doPasswordsMatch = formData.password === formData.confirmPassword;
      const passwordsNotEmpty =
        formData.password !== "" && formData.confirmPassword !== "";
      const areTermsAccepted = formData.termsAccepted;

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
          "http://localhost:8000/tasks/api/v1/verificar-correo/",
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
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Error al verificar el correo. Intenta nuevamente.",
        }));
      } finally {
        setIsValidating(false);
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
            showErrorToast(
              "Error al completar el registro en la base de datos."
            );
            return;
          }

          await client.auth.updateUser({
            data: { usuario_db_id: userData.id },
          });
        }

        localStorage.removeItem("registerFormData");
        localStorage.removeItem("registerStep");

        if (authData.session) {
          client.auth.signOut();
        }
        const idProyectoParam = params.get("id_proyecto");
        let idProyectoToAssociate = idProyectoParam;
        if (!idProyectoToAssociate && next) {
          try {
            const qs = new URLSearchParams(next.split("?")[1] || "");
            idProyectoToAssociate = qs.get("id_proyecto");
          } catch {}
        }
        if (idProyectoToAssociate) {
          try {
            const response = await fetch(
              "http://localhost:8000/tasks/api/v1/asociar_colaborador/",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_proyecto: idProyectoToAssociate,
                  email: formData.email,
                  exp: params.get("exp"),
                }),
              }
            );
            const data = await response.json().catch(()=>({}));

            if (!response.ok){
              if (data?.error === "Este usuario ya hace parte de este proyecto.") {
                showSuccessToast("Ya haces parte de este proyecto.");
              }
              else if (data?.error === "Un administrador no puede asociarse como colaborador."){
                showErrorToast(data.error);
              } else if (data?.error === "Un colaborador no puede estar en más de un proyecto."){
                showErrorToast(data.error);
               }
              else {
                showErrorToast(data?.error || "Error al asociar colaborador al proyecto.");
              }
            } else {
              // Asociación OK: historial (si tu helper existe) sin romper si no está definido
              if (
                typeof idUsuario !== "undefined" &&
                idUsuario &&
                !isNaN(Number(idUsuario)) &&
                typeof actualizarHistorialColaborador === "function"
              ) {
                await actualizarHistorialColaborador(
                  Number(idUsuario),
                  Number(idProyectoToAssociate),
                  "activo"
                );
              }
            }
          } catch (err) {
            showErrorToast("Error al asociar colaborador al proyecto.");
          }
        }
        let loginUrl = `/iniciar-sesion?next=${encodeURIComponent(next)}`;
        if (idProyectoParam) loginUrl += `&id_proyecto=${idProyectoParam}`;
        const expParam = params.get("exp");
        if (expParam) loginUrl += `&exp=${encodeURIComponent(expParam)}`;

        toast.dismiss(toastId);
        showSuccessToast("¡Cuenta creada! Ahora puedes iniciar sesión.");
        sessionStorage.setItem("skipProjectLimitOnce", "1");
        navigate(loginUrl);
      } catch (err) {
        toast.dismiss(toastId);
        showErrorToast("Error inesperado al registrar.");
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <FormContainer>
      {step === 1 ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Registrar cuenta
          </h1>
          <p className="text-gray-400 text-center mb-8">
            ¿Ya estás registrado?{" "}
            <Link
              to="/iniciar-sesion"
              className="text-purple-400 hover:underline font-semibold"
            >
              Iniciar sesión
            </Link>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="border border-slate-800/40 rounded-3xl shadow-lg p-8 w-full hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md"
          >
            <Input
              label="Nombres"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              errorMessage={errors.firstName}
              icon="bi-person-fill"
              placeholder="Ingresa tus nombres"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200 pr-12"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
            />
            <Input
              label="Apellidos"
              type="text"
              name="lastName"
              value={formData.lastName}
              errorMessage={errors.lastName}
              onChange={handleChange}
              icon="bi-person-fill"
              placeholder="Ingresa tus apellidos"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200 pr-12"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
            />
            <Input
              label="Correo"
              type="email"
              name="email"
              value={formData.email}
              errorMessage={errors.email}
              onChange={handleChange}
              icon="bi-envelope-fill"
              placeholder="Ingresa tu correo"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200 pr-12"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
            />
            <Button
              onClick={handleNext}
              disabled={isSubmitDisabled || isValidating}
              className={`w-full mt-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-purple-400 transition-all duration-200 ${
                isSubmitDisabled || isValidating
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Siguiente
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Registrar cuenta
          </h1>
          <p className="text-gray-400 text-center mb-8">
            ¡Casi listo! Continúa con la creación de tu contraseña.
          </p>
          <form
            onSubmit={handleSubmit}
            className="border border-slate-800/40 rounded-3xl shadow-lg p-8 w-full hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md"
          >
            <PasswordInput
              label="Crear Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
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
              placeholder="Confirma tu contraseña"
              className="w-full px-4 py-3 bg-[#232336] text-white border border-slate-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-all duration-200"
              labelClassName="text-gray-300 font-medium mb-2"
              errorClassName="text-red-400 text-sm mt-1"
            />
            <Checkbox
              label={
                <>
                  Acepto los{" "}
                  <Link
                    to="/terminos"
                    state={{ from: "/registrarse" }}
                    className="text-purple-400 hover:underline font-semibold"
                    onClick={() => saveRegisterFormToStorage(formData, step)}
                  >
                    Términos de Servicio
                  </Link>{" "}
                  y{" "}
                  <Link
                    to="/politica-de-privacidad"
                    state={{ from: "/registrarse" }}
                    className="text-purple-400 hover:underline font-semibold"
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
            <div className="flex justify-between space-x-8 mt-4">
              <Button
                onClick={handleBack}
                disabled={isRegistering}
                className="bg-slate-700 text-white font-bold py-3 rounded-xl shadow-md hover:bg-slate-600 transition-all duration-200 w-1/2"
              >
                Atrás
              </Button>
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={isStep2SubmitDisabled || isRegistering}
                className={`w-1/2 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-purple-400 transition-all duration-200 ${
                  isStep2SubmitDisabled || isRegistering
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Registrar
              </Button>
            </div>
          </form>
        </>
      )}
    </FormContainer>
  );
};

export default Register;
