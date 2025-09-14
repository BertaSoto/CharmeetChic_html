document.addEventListener("DOMContentLoaded", () => {
    // -------- Toggle Mostrar/Ocultar contraseña --------
    document.querySelectorAll(".toggle-pass").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-target");
            const input = document.getElementById(id);
            const showing = input.type === "text";
            input.type = showing ? "password" : "text";
            btn.setAttribute("aria-pressed", String(!showing));
            btn.title = showing ? "Mostrar contraseña" : "Ocultar contraseña";
            btn.textContent = showing ? "👁" : "🙈";
        });
    });

    // -------- Helpers --------
    const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
    const userOk = (u) => u && u.trim().length >= 3;
    const passOk = (p) => p && p.length >= 6;

    // -------- Recordar Usuario --------
    const remembered = localStorage.getItem("rememberUser");
    const rememberCb = document.getElementById("remember");
    const loginUser = document.getElementById("loginUser");
    if (remembered) {
        loginUser.value = remembered;
        rememberCb.checked = true;
    }

    // -------- LOGIN --------
    const formLogin = document.getElementById("formLogin");
    formLogin.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const userOrEmail = document.getElementById("loginUser").value.trim();
        const pass = document.getElementById("loginPass").value;
        const msg = document.getElementById("msgLogin");

        const validUser = userOrEmail.includes("@") ? emailOk(userOrEmail) : userOk(userOrEmail);

        if (!validUser || !passOk(pass)) {
            msg.style.color = "#b00";
            msg.textContent = "Usuario/correo o contraseña incorrectos.";
            return;
        }

        // Simulación de acceso correcto
        msg.style.color = "green";
        msg.textContent = "¡Acceso correcto!";

        // Guardar "recordarme"
        if (rememberCb.checked) {
            localStorage.setItem("rememberUser", userOrEmail);
        } else {
            localStorage.removeItem("rememberUser");
        }

        formLogin.reset();
    });

    // -------- REGISTRO --------
    const formReg = document.getElementById("formRegistro");
    const strengthMsg = document.getElementById("strengthMsg");

    const checkStrength = (pass) => {
        if (pass.length < 6) return "Débil ❌";
        if (/[A-Z]/.test(pass) && /\d/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
            return "Fuerte 💪";
        }
        return "Media ⚡";
    };

    document.getElementById("regPass").addEventListener("input", (e) => {
        strengthMsg.textContent = "Fortaleza: " + checkStrength(e.target.value);
    });

    formReg.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const user = document.getElementById("regUser").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const pass = document.getElementById("regPass").value;
        const msg = document.getElementById("msgRegistro");

        if (!userOk(user) || !emailOk(email) || !passOk(pass)) {
            msg.style.color = "#b00";
            msg.textContent = "Completa usuario (3+), correo válido y contraseña (6+).";
            return;
        }

        // Simulación de registro correcto
        msg.style.color = "green";
        msg.textContent = "¡Cuenta creada! Ahora puedes iniciar sesión.";
        formReg.reset();
        strengthMsg.textContent = "";
    });
});

