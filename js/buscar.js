// === Buscador global (se monta solo en el header) ===
(function () {
    // dataset de sugerencias (puedes agregar/ordenar a gusto)
    const DATA = [
        "Aros", "Anillos", "Collares", "Pulseras", "Tocados",
        "Colgantes", "Aretes", "Cadenas", "Dijes", "Argollas",
        "Plata 925", "Personalizaciones", "Reparaciones"
    ];

    // 1) encontramos el icono de buscar del header
    const contIconos = document.querySelector(".iconos");
    if (!contIconos) return;

    const iconBuscar = Array.from(contIconos.querySelectorAll("img"))
        .find(img => (img.alt || "").toLowerCase().includes("buscar"));
    if (!iconBuscar) return;

    // 2) creamos el contenedor del buscador y lo insertamos al lado del icono
    const wrap = document.createElement("div");
    wrap.className = "buscador";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Buscar...";
    input.className = "buscador-input";
    input.setAttribute("aria-label", "Buscar");

    const lista = document.createElement("ul");
    lista.className = "buscador-lista";

    // insertamos después del icono de buscar
    iconBuscar.parentElement.insertAdjacentElement("afterend", wrap);
    wrap.appendChild(input);
    wrap.appendChild(lista);

    // helpers
    const render = (items) => {
        lista.innerHTML = "";
        items.forEach((txt, idx) => {
            const li = document.createElement("li");
            li.className = "buscador-item";
            li.textContent = txt;
            li.tabIndex = -1;
            li.addEventListener("click", () => seleccionar(txt));
            lista.appendChild(li);
        });
        lista.style.display = items.length ? "block" : "none";
    };

    const filtrar = (q) =>
        DATA.filter(x => x.toLowerCase().includes(q.toLowerCase()));

    const seleccionar = (txt) => {
        input.value = txt;
        lista.style.display = "none";
        // aquí podrías redirigir al catálogo con querystring si quieres:
        // window.location.href = `catalogo.html?q=${encodeURIComponent(txt)}`;
    };

    // 3) eventos
    iconBuscar.style.cursor = "pointer";
    iconBuscar.addEventListener("click", () => {
        const visible = input.style.display === "inline-block";
        if (visible) {
            input.style.display = "none";
            lista.style.display = "none";
        } else {
            input.style.display = "inline-block";
            input.focus();
        }
    });

    input.addEventListener("input", () => {
        const q = input.value.trim();
        if (!q) { lista.style.display = "none"; return; }
        render(filtrar(q));
    });

    // navegación con teclado (↑ ↓ Enter Esc)
    let idxAct = -1;
    input.addEventListener("keydown", (e) => {
        const items = Array.from(lista.querySelectorAll(".buscador-item"));
        if (!items.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            idxAct = (idxAct + 1) % items.length;
            marcar(items, idxAct);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            idxAct = (idxAct - 1 + items.length) % items.length;
            marcar(items, idxAct);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (idxAct >= 0) seleccionar(items[idxAct].textContent);
            else if (input.value.trim()) seleccionar(input.value.trim());
        } else if (e.key === "Escape") {
            lista.style.display = "none";
            input.blur();
        }
    });

    function marcar(items, idx) {
        items.forEach(el => el.classList.remove("activo"));
        if (idx >= 0 && items[idx]) items[idx].classList.add("activo");
    }

    // cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
        const dentro = wrap.contains(e.target) || e.target === iconBuscar;
        if (!dentro) {
            lista.style.display = "none";
            input.style.display = "none";
        }
    });
})();
