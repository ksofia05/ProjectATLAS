document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form"); // Selecciona el formulario
    const inputs = form.querySelectorAll("input[required]"); // Selecciona todos los inputs requeridos
    const termsCheckbox = form.querySelector("input[name='terms']"); // Selecciona la casilla de términos
    const toggleIcons = document.querySelectorAll(".toggle-password"); // Selecciona los iconos de mostrar/ocultar contraseña
    const submitButton = form.querySelector("button[type='submit']"); // Botón de "Registrar"

    // Deshabilita el botón inicialmente
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // Valida los campos al escribir
    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            validateField(input);
            toggleSubmitButton(); // Actualiza el estado del botón
        });
    });

    // Valida la casilla de términos al cambiar
    if (termsCheckbox) {
        termsCheckbox.addEventListener("change", () => {
            toggleSubmitButton(); // Actualiza el estado del botón
        });
    }

    // Validación al enviar el formulario
    form.addEventListener("submit", (event) => {
        let isValid = true;

        inputs.forEach((input) => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        // Asegura que el campo de contraseña y confirmación de contraseña coincidan
        const password = form.querySelector("#password");
        const confirmPassword = form.querySelector("#confirm_password");
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            showError(confirmPassword, "Las contraseñas no coinciden");
            isValid = false;
        }

        // Validar que se acepten los términos y condiciones
        if (termsCheckbox && !termsCheckbox.checked) {
            showTermsError(termsCheckbox, "Debes aceptar Términos y Condiciones para continuar");
            isValid = false;
        } else {
            clearTermsError(termsCheckbox);
        }

        // Si hay errores, evita el envío del formulario
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Valida los inputs de manera individual
    function validateField(input) {
        // Busca si ya existe un mensaje de error
        let errorMessage = input.parentNode.querySelector(".error-message");

        // Elimina el mensaje de error si el campo es válido
        if (input.value.trim()) {
            if (input.id === "nombre" || input.id === "apellido") {
                if (input.value.length > 45) {
                    showError(input, "Este campo no puede exceder los 45 caracteres");
                    return false;
                }
            }

            if (input.id === "email") {
                if (!isValidEmail(input.value)) {
                    showError(input, "Por favor, ingresa un correo válido (ejemplo@dominio.com)");
                    return false;
                }
            }

            if (input.id === "password") {
                if (!isValidPassword(input.value)) {
                    showError(input, "La contraseña no cumple con los requisitos");
                    return false;
                }
            }

            if (errorMessage) {
                errorMessage.remove(); // Elimina el mensaje existente si el campo es válido
            }
            return true;
        }

        // Si no existe un mensaje de error, se crea uno nuevo (Evitar duplicados)
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "0.9rem";
            input.parentNode.appendChild(errorMessage);
        }

        // Actualiza el contenido del mensaje de error (No sobreescribir el mensaje anterior)
        errorMessage.textContent = `Por favor, completa el campo ${input.name}`;
        return false;
    }

    // Función para mostrar un mensaje de error
    function showError(input, message) {
        let errorMessage = input.parentNode.querySelector(".error-message");

        // Crea el mensaje de error si no existe
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            input.parentNode.appendChild(errorMessage);
        }

        errorMessage.textContent = message;
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "0.9rem";
    }

    // Función para mostrar un mensaje de error específico para los terminos
    function showTermsError(checkbox, message) {
        let errorMessage = checkbox.closest("label").parentNode.querySelector(".terms-error");

        // Crea el mensaje de error si no existe
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("terms-error");
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "0.9rem";
            errorMessage.style.display = "block";
            checkbox.closest("label").parentNode.appendChild(errorMessage);
        }

        errorMessage.textContent = message;
    }

    // Función para limpiar el mensaje de error de términos
    function clearTermsError(checkbox) {
        const errorMessage = checkbox.closest("label").parentNode.querySelector(".terms-error");
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Función para validar el formato de la contraseña
    function isValidPassword(password) {
        // Al menos 8 caracteres, un número, una letra mayúscula y un carácter especial
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/; //Esto se puede cambiar, pero no se si es lo mejor
        return passwordRegex.test(password);
    }

    // Función para validar el formato del correo electrónico
    function isValidEmail(email) {
        // Validar que el correo tenga un formato válidoc
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para mostrar/ocultar contraseñas (ojito)
    const togglePasswordVisibility = () => {
        toggleIcons.forEach((icon) => {
            icon.addEventListener("click", () => {
                // Selecciona el input dentro del mismo contenedor .relative
                const input = icon.closest(".relative").querySelector("input");
                if (input) {
                    if (input.type === "password") {
                        input.type = "text";
                        icon.innerHTML = `<i class="bi bi-eye-slash"></i>`; // Icono de ojo cerrado
                    } else {
                        input.type = "password";
                        icon.innerHTML = `<i class="bi bi-eye"></i>`; // Icono de ojo abierto
                    }
                }
            });
        });
    };

    // Función para habilitar/deshabilitar el botón de "Siguiente"
    function toggleSubmitButton() {
        let isValid = true;

        inputs.forEach((input) => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
        }

        if (isValid) {
            submitButton.disabled = false;
            submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        } else {
            submitButton.disabled = true;
            submitButton.classList.add("opacity-50", "cursor-not-allowed");
        }
    }

    // Esto llama a la función para mostrar/ocultar contraseñas al cargar la página
    togglePasswordVisibility();
});