document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = form.querySelector("#email");
    const passwordInput = form.querySelector("#password");
    const submitButton = form.querySelector("button[type='submit']");
    const togglePasswordIcon = document.querySelector(".toggle-password");

    // Función para validar el formato del correo
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Función para mostrar/ocultar la contraseña (ojito)
    togglePasswordIcon.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.innerHTML = `<i class="bi bi-eye-slash"></i>`; // Cambia al icono de ojo cerrado
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.innerHTML = `<i class="bi bi-eye"></i>`; // Cambia al icono de ojo abierto
        }
    });

    // Función para mostrar un mensaje de error (se aplica para todos los inputs)
    function showError(input, message) {
        let errorMessage = input.parentNode.querySelector(".error-message");

        if (!errorMessage) {
            errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.style.color = "red";
            errorMessage.style.fontSize = "0.9rem";
            input.parentNode.appendChild(errorMessage);
        }

        errorMessage.textContent = message;
    }

    // Función para eliminar el mensaje de error (igualmente que el anterior, se aplica para todos los inputs)
    function clearError(input) {
        const errorMessage = input.parentNode.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Función para habilitar o deshabilitar el botón "Ingresar" (Esto vuelve el boton un poco mas opaco, y el cursor no puede hacer click)
    function toggleSubmitButton() {
        if (isValidEmail(emailInput.value) && passwordInput.value.trim().length >= 8) {
            submitButton.disabled = false;
            submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        } else {
            submitButton.disabled = true;
            submitButton.classList.add("opacity-50", "cursor-not-allowed");
        }
    }

    // Validación en tiempo real para el correo (Directamente el usuario ve si su correo es correcto o no) (Aun faltan algunas cosas a mejorar )
    emailInput.addEventListener("input", () => {
        if (!isValidEmail(emailInput.value)) {
            showError(emailInput, "Por favor, ingresa un correo válido (ejemplo@dominio.com)");
        } else {
            clearError(emailInput);
        }
        toggleSubmitButton();
    });

    // Validación en tiempo real para la contraseña (Al igual que el anterior, faltan unas cosas para mejorar en cuanto a la visibilidad)
    passwordInput.addEventListener("input", () => {
        toggleSubmitButton();
    });

    // Validación al enviar el formulario (Aqui es se verifica si el formulario cumple con los requisitos minimos para poder ser enviado a la base de datos)
    form.addEventListener("submit", (event) => {
        let isValid = true;

        if (!isValidEmail(emailInput.value)) {
            showError(emailInput, "Por favor, ingresa un correo válido (ejemplo@dominio.com)");
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (passwordInput.value.trim().length < 8) {
            showError(passwordInput, "La contraseña debe tener al menos 8 caracteres");
            isValid = false;
        } else {
            clearError(passwordInput);
        }

      
    });

    // Deshabilita el botón al cargar la página
    toggleSubmitButton();
});