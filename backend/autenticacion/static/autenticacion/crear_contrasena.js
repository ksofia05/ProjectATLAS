document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-password-form");
    const newPassword = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");
    const submitButton = form.querySelector("button[type='submit']");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const toggleIcons = document.querySelectorAll(".toggle-password");

    // Deshabilitar el botón inicialmente
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // Mostrar/ocultar contraseñas
    toggleIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            const input = icon.closest(".relative").querySelector("input");
            if (input.type === "password") {
                input.type = "text";
                icon.innerHTML = `<i class="bi bi-eye-slash"></i>`;
            } else {
                input.type = "password";
                icon.innerHTML = `<i class="bi bi-eye"></i>`;
            }
        });
    });

    // Validar contraseñas en tiempo real
    const validatePasswords = () => {
        const passwordValue = newPassword.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();

        // Validar si las contraseñas coinciden y cumplen con los requisitos
        if (
            passwordValue === confirmPasswordValue &&
            isValidPassword(passwordValue)
        ) {
            submitButton.disabled = false;
            submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        } else {
            submitButton.disabled = true;
            submitButton.classList.add("opacity-50", "cursor-not-allowed");
        }
    };

    // Escuchar eventos de entrada en los campos de contraseña
    newPassword.addEventListener("input", validatePasswords);
    confirmPassword.addEventListener("input", validatePasswords);

    // Validar contraseñas al enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        if (newPassword.value !== confirmPassword.value) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        if (!isValidPassword(newPassword.value)) {
            alert("La contraseña no cumple con los requisitos.");
            return;
        }

        // Mostrar el pop-up 
        popup.classList.remove("hidden");
        overlay.classList.remove("hidden");
    });

    // Validar formato de la contraseña
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/; //Requisitos para la contraseña
        return passwordRegex.test(password);
    }
});