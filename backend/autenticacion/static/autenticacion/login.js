document.addEventListener("DOMContentLoaded", () => {
    const toggleIcons = document.querySelectorAll(".toggle-password");

    // agrega los clics (faltas varias cosas)
    toggleIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
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
});