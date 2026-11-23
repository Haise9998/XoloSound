// chatbot.js - Asistente Virtual para XOLO SOUND
const GEMINI_API_KEY = "TU_API_KEY_AQUI"; // Restríngela en Google AI Studio solo para https://haise9998.github.io/*

const CONTEXTO_NEGOCIO = `
Eres el asesor experto de XOLO SOUND, negocio con 14 años de experiencia ubicado en El Hongo, Tecate, Baja California.
Especialidades: audio automotriz, pantallas Android, amplificadores, bocinas, subwoofers y herramientas (productos nuevos y seminuevos).
WhatsApp oficial para cerrar tratos, instalaciones o dudas: https://wa.me/6651205695
Reglas:
1. Responde de forma amable, directa y con conocimiento técnico de Car Audio (impedancias, RMS, medidas de bocinas, compatibilidad de arneses).
2. Si el cliente pregunta por precios o disponibilidad, consulta ÚNICAMENTE la lista de productos del catálogo actual que te paso abajo.
3. Invita al cliente a agregar productos al carrito de la página o escribir al WhatsApp (665 120 5695) para agendar instalación o envío.
`;

// Extrae automáticamente los productos que tu JS ya renderizó en el catálogo de la página
function obtenerCatalogoEnVivo() {
  const textoPagina = document.body.innerText;
  const inicio = textoPagina.indexOf("Catálogo de Productos");
  const fin = textoPagina.indexOf("Carrito de Compras");
  if (inicio !== -1 && fin !== -1) {
    return textoPagina.slice(inicio, fin).trim();
  }
  return "Catálogo cargando o sin productos visibles en este momento.";
}

// Crea la interfaz flotante del chat
function iniciarWidgetXolo() {
  const estilo = document.createElement("style");
  estilo.textContent = `
    #xolo-chat-btn { position: fixed; bottom: 20px; right: 20px; background: #e63946; color: #fff; border: none; border-radius: 50px; padding: 14px 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999; }
    #xolo-chat-box { display: none; position: fixed; bottom: 80px; right: 20px; width: 340px; max-width: 90vw; height: 450px; background: #1a1a1a; color: #f1f1f1; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); flex-direction: column; overflow: hidden; z-index: 9999; font-family: sans-serif; }
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
      <div class="xolo-msg-bot">¡Qué tal! Soy el asistente de <b>XOLO SOUND</b>. ¿Buscas pantallas Android, bocinas, amplificadores o herramientas para tu auto?</div>
    </div>
    <form id="xolo-chat-form">
      <input id="xolo-chat-input" type="text" placeholder="Ej. ¿Qué subwoofers tienes?" required />
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

    const promptCompleto = `${CONTEXTO_NEGOCIO}\n\nCATÁLOGO ACTUAL EN LA PÁGINA:\n${obtenerCatalogoEnVivo()}\n\nPREGUNTA DEL CLIENTE: ${pregunta}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptCompleto }] }]
          })
        }
      );
      const data = await res.json();
      const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude procesar tu consulta. Escríbenos directo al WhatsApp 665 120 5695.";
      document.getElementById(loadingId).innerHTML = respuesta.replace(/\n/g, "<br>");
    } catch (err) {
      document.getElementById(loadingId).textContent = "Error de conexión. Contáctanos por WhatsApp al 665 120 5695.";
    }
    msgs.scrollTop = msgs.scrollHeight;
  };
}

window.addEventListener("DOMContentLoaded", iniciarWidgetXolo);