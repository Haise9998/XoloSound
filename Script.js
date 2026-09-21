const productos = [
    {
        nombre: "Pioneer TS-A6970F",
        categoria: "audio",
        estado: "nuevo",
        icono: "🔊",
        precio: 1250
    },
    {
        nombre: "Subwoofer JBL Stage 1220",
        categoria: "audio",
        estado: "nuevo",
        icono: "🔊",
        precio: 2600
    },
    {
        nombre: "Pantalla Android 10 Pulgadas",
        categoria: "pantalla",
        estado: "nuevo",
        icono: "📺",
        precio: 4200
    },
    {
        nombre: "Amplificador Pioneer GM",
        categoria: "audio",
        estado: "nuevo",
        icono: "⚡",
        precio: 3500
    },
    {
        nombre: "Kicker CompR 12",
        categoria: "audio",
        estado: "seminuevo",
        icono: "🔊",
        precio: 1800
    },
    {
        nombre: "Kenwood 1000W",
        categoria: "audio",
        estado: "seminuevo",
        icono: "⚡",
        precio: 2200
    },
    {
        nombre: "Pantalla Android Usada",
        categoria: "pantalla",
        estado: "seminuevo",
        icono: "📺",
        precio: 2100
    },
    {
        nombre: "Taladro Milwaukee",
        categoria: "herramienta",
        estado: "seminuevo",
        icono: "🛠️",
        precio: 1800
    }
];

let carrito = [];
let listaActual = [...productos];

function render(lista) {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = "";

    if (lista.length === 0) {
        catalogo.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No se encontraron productos.</p>`;
        return;
    }

    lista.forEach(producto => {
        catalogo.innerHTML += `
        <div class="producto">
            <span class="estado ${producto.estado}">
                ${producto.estado.toUpperCase()}
            </span>
            <div class="icono">
                ${producto.icono}
            </div>
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <span class="precio">$${producto.precio}</span>
            <button onclick="agregarCarrito('${producto.nombre}', ${producto.precio})">
                Agregar al carrito
            </button>
        </div>
        `;
    });
}

// Búsqueda por nombre (Actividad 5)
function buscarProducto() {
    const texto = document.getElementById("busqueda").value.toLowerCase();
    const categoriaSelect = document.getElementById("categoria").value;

    listaActual = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoriaSelect === "todos" || producto.categoria === categoriaSelect || producto.estado === categoriaSelect;
        return coincideNombre && coincideCategoria;
    });

    render(listaActual);
}

// Filtrar por categoría o estado (Actividad 5)
function filtrarCategoria() {
    buscarProducto();
}

// Ordenar de Menor a Mayor (Actividad 5)
function ordenPrecioAsc() {
    listaActual.sort((a, b) => a.precio - b.precio);
    render(listaActual);
}

// Ordenar de Mayor a Menor (Actividad 5)
function ordenPrecioDesc() {
    listaActual.sort((a, b) => b.precio - a.precio);
    render(listaActual);
}

// Ordenar Alfabéticamente A-Z (Actividad 5)
function ordenNombre() {
    listaActual.sort((a, b) => a.nombre.localeCompare(b.nombre));
    render(listaActual);
}

function agregarCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    lista.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = `<li style="text-align:center; color:#777; border:none;">El carrito está vacío.</li>`;
    }

    carrito.forEach(item => {
        total += item.precio;
        lista.innerHTML += `<li>${item.nombre} - $${item.precio} MXN</li>`;
    });

    document.getElementById("total").innerText = `Total: $${total} MXN`;
}

// Inicializar la vista cargando todos los productos y el carrito vacío
render(productos);
actualizarCarrito();
