document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputs = form.querySelectorAll("input[required]");

    // Aqui se valida antes de salir de cada imput
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

        // Si hay errores, no se envía el formulario
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Evalua si el campo es válido o no y debería mostrar un mensaje de error si es necesario
    function validateField(input) {
        // Verifica si el campo está vacío o no
        let errorMessage = input.parentNode.querySelector(".error-message");

        // Limpia el mensaje si el campo está lleno y válido (sujeto a cambios)
        if (input.value.trim()) {
            if (input.type === "email") {
                if (!isValidEmail(input.value)) {
                    showError(input, "Correo inválido");
                    return false;
                }
            }

            if (errorMessage) {
                errorMessage.remove(); // el mensaje se elimina si el campo es válido
            }
            return true;
        }

        // Verifica si no hay un mensaje de error existente y lo crea si es necesario
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "0.9rem";
            input.parentNode.appendChild(errorMessage);
        }

        // Actualiza el contenido del mensaje de error
        errorMessage.textContent = input.type === "email" ? "Correo inválido" : `Por favor, completa el campo ${input.name}`;
        return false;
    }

    // Función para mostrar un mensaje de error
    function showError(input, message) {
        let errorMessage = input.parentNode.querySelector(".error-message");

        // Si no existe el mensaje de error, lo crea
        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            input.parentNode.appendChild(errorMessage);
        }

        errorMessage.textContent = message;
        errorMessage.style.color = "red";
        errorMessage.style.fontSize = "0.9rem";
    }

    // Función para validar el formato del correo electrónico
    function isValidEmail(email) {
        // Valida el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para mostrar/ocultar contraseñas (ojito)
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

    // inicializa la función de mostrar/ocultar contraseñas
    togglePasswordVisibility();
});