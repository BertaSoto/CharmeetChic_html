document.addEventListener("DOMContentLoaded", () => {
    /* ===== Toggle mostrar/ocultar contraseña ===== */
    document.querySelectorAll(".toggle-pass").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-target");
            const input = document.getElementById(id);
            if (!input) return;
            const showing = input.type === "text";
            input.type = showing ? "password" : "text";
            btn.setAttribute("aria-pressed", String(!showing));
            btn.title = showing ? "Mostrar contraseña" : "Ocultar contraseña";
            btn.textContent = showing ? "👁" : "🙈";
        });
    });

    /* ===== Helpers ===== */
    const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
    const userOk = (u) => !!u && u.trim().length >= 3;
    const passOk = (p) => !!p && p.length >= 6;

    // setErr: funciona aunque no exista el <small>, igual retorna válido/ inválido
    const setErr = (input, msgEl, msg) => {
        if (msg) {
            if (input) input.classList.add("error");
            if (msgEl) msgEl.textContent = msg;
            return false;
        } else {
            if (input) input.classList.remove("error");
            if (msgEl) msgEl.textContent = "";
            return true;
        }
    };

    /* ===== Prefill Recuérdame ===== */
    const rememberCb = document.getElementById("remember");
    const loginUser = document.getElementById("loginUser");
    const remembered = localStorage.getItem("rememberUser");
    if (remembered && loginUser && rememberCb) {
        loginUser.value = remembered;
        rememberCb.checked = true;
    }

    /* ===== LOGIN ===== */
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (ev) => {
            ev.preventDefault();
            const userOrEmail = (document.getElementById("loginUser")?.value || "").trim();
            const pass = document.getElementById("loginPass")?.value || "";
            const msg = document.getElementById("msgLogin");
            const errUser = document.getElementById("errLoginUser");
            const errPass = document.getElementById("errLoginPass");

            // vacíos
            const ok1 = setErr(document.getElementById("loginUser"), errUser, userOrEmail ? "" : "Este campo es obligatorio.");
            const ok2 = setErr(document.getElementById("loginPass"), errPass, pass ? "" : "Este campo es obligatorio.");
            if (!ok1 || !ok2) return;

            // formatos
            const validUser = userOrEmail.includes("@") ? emailOk(userOrEmail) : userOk(userOrEmail);
            const ok3 = setErr(document.getElementById("loginUser"), errUser, validUser ? "" : "Usuario (3+) o correo válido.");
            const ok4 = setErr(document.getElementById("loginPass"), errPass, passOk(pass) ? "" : "Contraseña de 6+ caracteres.");
            if (!ok3 || !ok4) return;

            // Recuérdame
            if (rememberCb?.checked) localStorage.setItem("rememberUser", userOrEmail);
            else localStorage.removeItem("rememberUser");

            if (msg) { msg.style.color = "green"; msg.textContent = "¡Acceso correcto!"; }
            // location.href = "../inicio.html"; // si quieres redirigir
        });
    }

    /* ===== Medidor de fortaleza (Registro) ===== */
    const regPass = document.getElementById("regPass");
    const passBar = document.getElementById("passBar");
    const passLabel = document.getElementById("passLabel");

    const calcStrength = (p) => {
        if (!p) return { score: 0, label: "—", color: "#b0b0b0", pct: 0 };
        let score = 0;
        if (p.length >= 6) score += 1;
        if (p.length >= 10) score += 1;
        if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score += 1;
        if (/\d/.test(p)) score += 1;
        if (/[^A-Za-z0-9]/.test(p)) score += 1;
        let label = "Débil", color = "#d9534f";
        if (score >= 4) { label = "Fuerte"; color = "#28a745"; }
        else if (score === 3) { label = "Media"; color = "#f0ad4e"; }
        else if (score <= 1) { label = "Muy débil"; color = "#d9534f"; }
        return { score, label, color, pct: Math.min(100, (score / 5) * 100) };
    };

    const renderStrength = () => {
        if (!regPass || !passBar || !passLabel) return; // si no pusiste el medidor, no rompe
        const { label, color, pct } = calcStrength(regPass.value);
        passBar.style.width = pct + "%";
        passBar.style.background = color;
        passLabel.textContent = "Fortaleza: " + label;
    };
    if (regPass) { regPass.addEventListener("input", renderStrength); renderStrength(); }

    /* ===== REGISTRO ===== */
    const formReg = document.getElementById("formRegistro");
    if (formReg) {
        formReg.addEventListener("submit", (ev) => {
            ev.preventDefault();
            const user = (document.getElementById("regUser")?.value || "").trim();
            const email = (document.getElementById("regEmail")?.value || "").trim();
            const pass = document.getElementById("regPass")?.value || "";

            const errUser = document.getElementById("errRegUser");
            const errEmail = document.getElementById("errRegEmail");
            const errPass = document.getElementById("errRegPass");
            const msg = document.getElementById("msgRegistro");

            // vacíos
            const okU = setErr(document.getElementById("regUser"), errUser, user ? "" : "Este campo es obligatorio.");
            const okE = setErr(document.getElementById("regEmail"), errEmail, email ? "" : "Este campo es obligatorio.");
            const okP = setErr(document.getElementById("regPass"), errPass, pass ? "" : "Este campo es obligatorio.");
            if (!okU || !okE || !okP) return;

            // formato
            const okU2 = setErr(document.getElementById("regUser"), errUser, userOk(user) ? "" : "Mínimo 3 caracteres.");
            const okE2 = setErr(document.getElementById("regEmail"), errEmail, emailOk(email) ? "" : "Correo válido: nombre@dominio.ext");
            const okP2 = setErr(document.getElementById("regPass"), errPass, passOk(pass) ? "" : "Contraseña de 6+ caracteres.");
            if (!okU2 || !okE2 || !okP2) return;

            // fortaleza mínima (>= Media)
            const { score } = calcStrength(pass);
            if (score < 3) { setErr(document.getElementById("regPass"), errPass, "Contraseña débil. Usa mayúsculas, números y símbolos."); return; }
            setErr(document.getElementById("regPass"), errPass, "");

            if (msg) { msg.style.color = "green"; msg.textContent = "¡Cuenta creada! Ahora puedes iniciar sesión."; }
            formReg.reset();
            renderStrength(); // resetea medidor si existe
        });
    }
});

