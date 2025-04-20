// Seleccionar elementos
const form = document.getElementById("recover-form");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("close-popup");
const content = document.querySelector(".bg-gray-900"); // Contenedor principal

// Mostrar el pop-up al enviar el formulario
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar el envío del formulario
    popup.style.display = "block";
    overlay.style.display = "block";
    content.classList.add("hidden"); // Ocultar el contenido principal
});

// Redirigir al nuevo template al cerrar el pop-up
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";

    // Redirigir al template de reenvío
    window.location.href = "/autenticacion/reenviar_enlace/";
});