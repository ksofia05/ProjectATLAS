document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recover-form");
    const emailInput = document.getElementById("email");
    const submitButton = form.querySelector("button[type='submit']");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const closePopup = document.getElementById("close-popup");

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

    // Mostrar el pop-up al enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar el envío del formulario

        // Mostrar el pop-up y el overlay
        popup.classList.remove("hidden");
        overlay.classList.remove("hidden");

        // Ocultar el formulario principal
        form.parentElement.classList.add("hidden");
    });

    // Redirigir al nuevo template al cerrar el pop-up
    const redirectToReenviarEnlace = () => {
        popup.classList.add("hidden");
        overlay.classList.add("hidden");

        // Redirigir al template de reenvío
        window.location.href = "/autenticacion/reenviar_enlace/";
    };

    // Cerrar el pop-up al hacer clic en el botón de cerrar
    closePopup.addEventListener("click", redirectToReenviarEnlace);

    // Cerrar el pop-up al hacer clic en el fondo oscuro
    overlay.addEventListener("click", redirectToReenviarEnlace);

    // Función para validar el correo electrónico
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Verifica que tenga "@" y ".com" o similar
        return emailRegex.test(email);
    }
});