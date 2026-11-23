// chatbot.js - Asistente Virtual para XOLO SOUND
const KEY_PARTE_1 = "AIzaSyACBY1TtxOUJIY";
const KEY_PARTE_2 = "eCK3MFruC0Rreu_saXiE";
const GEMINI_API_KEY = KEY_PARTE_1 + KEY_PARTE_2;

const CONTEXTO_NEGOCIO = `
Eres el asesor experto de XOLO SOUND, negocio con 14 años de experiencia en El Hongo, Tecate, Baja California.
Especialidades: audio automotriz, pantallas Android, amplificadores, bocinas, subwoofers y herramientas.
WhatsApp oficial: 665 120 5695 (https://wa.me/6651205695).

INSTRUCCIONES IMPORTANTES:
1. Cuando el cliente pregunte por un producto (ej. pantallas, subwoofers, bocinas, amplificadores, herramientas), menciona los modelos exactos del CATÁLOGO, su estado (Nuevo o Seminuevo) y su precio en MXN.
2. Si el cliente pide algo que NO está en el catálogo (como cables o accesorios sueltos), dile amablemente qué opciones relacionadas sí tenemos en la tienda e invítalo a preguntar disponibilidad en tienda física al WhatsApp 665 120 5695.
3. Sé breve, directo y amable.
`;

function obtenerCatalogoEnVivo() {
  if (typeof productos !== "undefined" && Array.isArray(productos)) {
    return productos
      .map(p => `• ${p.nombre} | Categoría: ${p.categoria} | Estado: ${p.estado.toUpperCase()} | Precio: $${p.precio} MXN`)
      .join("\n");
  }
  return "Catálogo no cargado.";
}

// Respuesta inteligente de respaldo usando tu catálogo real si la API falla o se queda sin cuota
function respuestaRespaldoCatalogo(pregunta) {
  if (typeof productos === "undefined" || !Array.isArray(productos)) {
    return "Contáctanos por WhatsApp al 665 120 5695 para cotizar al momento.";
  }

  const q = pregunta.toLowerCase();
  const palabrasClave = q
    .replace(/s\b/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);

  const coincidencias = productos.filter(p => {
    const textoProd = `${p.nombre} ${p.categoria} ${p.estado}`.toLowerCase();
    return palabrasClave.some(palabra => textoProd.includes(palabra));
  });

  if (coincidencias.length > 0) {
    const lista = coincidencias
      .map(p => `• <b>${p.nombre}</b> (${p.estado.toUpperCase()}) — <b>$${p.precio} MXN</b>`)
      .join("<br>");
    return `En <b>XOLO SOUND</b> tenemos estas opciones disponibles:<br><br>${lista}<br><br>Puedes agregarlas directo al carrito aquí en la página o escribirnos al WhatsApp <b>665 120 5695</b>.`;
  }

  const resumen = productos
    .map(p => `• ${p.nombre} ($${p.precio} MXN)`)
    .join("<br>");
  return `Por el momento en nuestro catálogo en línea contamos con:<br><br>${resumen}<br><br>Si buscas cables, arneses u otro accesorio específico, mándanos mensaje al WhatsApp <b>665 120 5695</b> y te confirmamos existencia en El Hongo, Tecate.`;
}

function iniciarWidgetXolo() {
  if (document.getElementById("xolo-chat-btn")) return;

  const estilo = document.createElement("style");
  estilo.textContent = `
    #xolo-chat-btn { position: fixed; bottom: 20px; right: 20px; background: #e63946; color: #fff; border: none; border-radius: 50px; padding: 14px 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 99999; font-family: sans-serif; }
    #xolo-chat-box { display: none; position: fixed; bottom: 80px; right: 20px; width: 340px; max-width: 90vw; height: 450px; background: #1a1a1a; color: #f1f1f1; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); flex-direction: column; overflow: hidden; z-index: 99999; font-family: sans-serif; border: 1px solid #333; }
    #xolo-chat-header { background: #e63946; padding: 12px 16px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
    #xolo-chat-msgs { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
    .xolo-msg-user { background: #e63946; color: #fff; align-self: flex-end; padding: 8px 12px; border-radius: 12px 12px 0 12px; max-width: 80%; }
    .xolo-msg-bot { background: #2b2b2b; color: #fff; align-self: flex-start; padding: 8px 12px; border-radius: 12px 12px 12px 0; max-width: 85%; line-height: 1.4; }
    #xolo-chat-form { display: flex; border-top: 1px solid #333; }
    #xolo-chat-input { flex: 1; padding: 10px; border: none; background: #222; color: #fff; outline: none; }
    #xolo-chat-send { background: #e63946; color: #fff; border: none; padding: 0 16px; cursor: pointer; font-weight: bold; }
  `;
  document.head.appendChild(estilo);

  const btn = document.createElement("button");
  btn.id = "xolo-chat-btn";
  btn.textContent = "🔊 Asesor Xolo Sound";

  const box = document.createElement("div");
  box.id = "xolo-chat-box";
  box.innerHTML = `
    <div id="xolo-chat-header">
      <span>XOLO SOUND | Asesor IA</span>
      <span id="xolo-close" style="cursor:pointer;">✖</span>
    </div>
    <div id="xolo-chat-msgs">
      <div class="xolo-msg-bot">¡Qué tal! Soy el asistente de <b>XOLO SOUND</b>. Pregúntame por precios o modelos de pantallas Android, bocinas, amplificadores o herramientas.</div>
    </div>
    <form id="xolo-chat-form">
      <input id="xolo-chat-input" type="text" placeholder="Ej. ¿Qué pantallas tienes?" required />
      <button id="xolo-chat-send" type="submit">Enviar</button>
    </form>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(box);

  btn.onclick = () => (box.style.display = box.style.display === "flex" ? "none" : "flex");
  document.getElementById("xolo-close").onclick = () => (box.style.display = "none");

  const msgs = document.getElementById("xolo-chat-msgs");
  const form = document.getElementById("xolo-chat-form");
  const input = document.getElementById("xolo-chat-input");

  form.onsubmit = async (e) => {
    e.preventDefault();
    const pregunta = input.value.trim();
    if (!pregunta) return;

    msgs.innerHTML += `<div class="xolo-msg-user">${pregunta}</div>`;
    input.value = "";
    const loadingId = "loading-" + Date.now();
    msgs.innerHTML += `<div class="xolo-msg-bot" id="${loadingId}">Revisando catálogo...</div>`;
    msgs.scrollTop = msgs.scrollHeight;

    const promptCompleto = `${CONTEXTO_NEGOCIO}\n\nCATÁLOGO DISPONIBLE EN XOLO SOUND:\n${obtenerCatalogoEnVivo()}\n\nPREGUNTA DEL CLIENTE: ${pregunta}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptCompleto }] }]
          })
        }
      );
      const data = await res.json();

      if (data.error) {
        console.warn("Aviso API Gemini:", data.error.message);
        document.getElementById(loadingId).innerHTML = respuestaRespaldoCatalogo(pregunta);
      } else {
        const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || respuestaRespaldoCatalogo(pregunta);
        document.getElementById(loadingId).innerHTML = respuesta.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
      }
    } catch (err) {
      console.warn("Error de red, usando catálogo local:", err);
      document.getElementById(loadingId).innerHTML = respuestaRespaldoCatalogo(pregunta);
    }
    msgs.scrollTop = msgs.scrollHeight;
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarWidgetXolo);
} else {
  iniciarWidgetXolo();
}
