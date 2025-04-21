document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resend-form");
    const emailInput = document.getElementById("email");
    const submitButton = form.querySelector("button[type='submit']");

    // Deshabilitar el botón inicialmente
    submitButton.disabled = true;
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // Validar el campo de correo electrónico
    emailInput.addEventListener("input", () => {
        const emailValue = emailInput.value.trim();
        if (isValidEmail(emailValue)) {
            submitButton.disabled = false;
            submitButton.classList.remove("opacity-50", "cursor-not-allowed");
        } else {
            submitButton.disabled = true;
            submitButton.classList.add("opacity-50", "cursor-not-allowed");
        }
    });

    // Función para validar el correo electrónico
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Verifica que tenga "@" y ".com" o similar
        return emailRegex.test(email);
    }
});