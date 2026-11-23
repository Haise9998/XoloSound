import streamlit as st
from dotenv import load_dotenv
from google import genai
from google.genai import types
from playwright.sync_api import sync_playwright

load_dotenv()
client = genai.Client()

st.set_page_config(page_title="Asistente XOLO SOUND", page_icon="🔊")
st.title("🔊 Asistente Virtual - XOLO SOUND")

@st.cache_data(ttl=600)
def extraer_xolosound(url: str) -> str:
    """Abre XoloSound en un navegador headless para capturar el catálogo renderizado por JS."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(1500)  # Espera a que JS pinte las tarjetas de productos
        contenido = page.inner_text("body")
        browser.close()
        return contenido

if "catalogo_xolo" not in st.session_state:
    with st.spinner("Sincronizando catálogo desde XoloSound..."):
        st.session_state["catalogo_xolo"] = extraer_xolosound("https://haise9998.github.io/XoloSound/")

if st.sidebar.button("🔄 Actualizar catálogo de la web"):
    st.cache_data.clear()
    st.session_state["catalogo_xolo"] = extraer_xolosound("https://haise9998.github.io/XoloSound/")
    st.sidebar.success("Catálogo actualizado.")

if "mensajes" not in st.session_state:
    st.session_state["mensajes"] = []

for msg in st.session_state["mensajes"]:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Pregunta por precios, bocinas, pantallas o herramientas..."):
    st.session_state["mensajes"].append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    instruccion = (
        "Eres el asesor de ventas de XOLO SOUND (El Hongo, Tecate, Baja California). "
        "Responde usando únicamente la información extraída de la tienda oficial:\n\n"
        f"{st.session_state['catalogo_xolo']}"
    )

    with st.chat_message("assistant"):
        respuesta = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
            config=types.GenerateContentConfig(system_instruction=instruccion),
        )
        st.markdown(respuesta.text)
        st.session_state["mensajes"].append({"role": "assistant", "content": respuesta.text})