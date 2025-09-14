document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formContacto");
    const mensajeExito = document.getElementById("mensajeExito");
    const mensajeError = document.getElementById("mensajeError");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita recargar la página

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        // Expresión regular simple para validar email
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

        if (nombre === "" || !emailRegex.test(email) || mensaje === "") {
            mensajeExito.style.display = "none";
            mensajeError.style.display = "block";
        } else {
            mensajeError.style.display = "none";
            mensajeExito.style.display = "block";

            // Aquí podrías enviar los datos con fetch() a un backend si lo deseas
            form.reset();
        }
    });
});
