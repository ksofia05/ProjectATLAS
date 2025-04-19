document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll("input[required]");
    const termsCheckbox = form.querySelector("input[name='terms']"); // Selecciona la casilla de términos 

    // valida los campos al escribir
    inputs.forEach((input) => {
        input.addEventListener("blur", () => {
            validateField(input);
        });
    });

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

    // valida los inputs de manera individual, osea cada uno hace la validacion
    function validateField(input) {
        // Busca si ya existe un mensaje de error
        let errorMessage = input.parentNode.querySelector(".error-message");

        // Elimina el mensaje de error si el campo es válido
        if (input.value.trim()) {
            if (input.id === "password") {
                if (!isValidPassword(input.value)) {
                    showError(input, "La contraseña debe tener al menos 8 caracteres y un número");
                    return false;
                }
            }

            if (errorMessage) {
                errorMessage.remove(); // Elimina el mensaje existente si el campo es válido
            }
            return true;
        }

        // Si no existe un mensaje de error, se crea uno nuevo
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "0.9rem";
            input.parentNode.appendChild(errorMessage);
        }

        // Actualiza el contenido del mensaje de error
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

    // Función para mostrar un mensaje de error específico para términos y condiciones
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
        // Al menos 8 caracteres y al menos un número
        const passwordRegex = /^(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    // Función para mostrar/ocultar contraseñas (Hay varios errores)
    const togglePasswordVisibility = () => {
        const toggleIcons = document.querySelectorAll(".toggle-password");
        toggleIcons.forEach((icon) => {
            icon.addEventListener("click", () => {
                // Selecciona el input dentro del mismo contenedor .relative
                const input = icon.closest(".relative").querySelector("input");
                if (input) {
                    if (input.type === "password") {
                        input.type = "text";
                        icon.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10c0 1.05-.162 2.062-.462 3.025m-1.538 2.538A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10c0 1.05-.162 2.062-.462 3.025" />
                            </svg>`;
                    } else {
                        input.type = "password";
                        icon.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9a9 9 0 100 18 9 9 0 000-18z" />
                            </svg>`;
                    }
                }
            });
        });
    };

    // Llama a la función para inicializar los eventos
    togglePasswordVisibility();
});