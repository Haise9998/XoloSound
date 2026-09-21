// ------------------------------------
// CARRITO DE COMPRAS
// ------------------------------------

let carrito = [];

// ------------------------------------
// AGREGAR PRODUCTO
// ------------------------------------
function agregarCarrito(nombre, precio) {
  const productoExistente = carrito.find(producto => producto.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }

  actualizarCarrito();
}

// ------------------------------------
// ACTUALIZAR CARRITO
// ------------------------------------
function actualizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<p class="mensaje-vacio">No hay productos en el pedido.</p>`;
  }

  carrito.forEach((producto, indice) => {
    const elemento = document.createElement("div");
    elemento.classList.add("item-carrito");

    elemento.innerHTML = `
      <h4>${producto.nombre}</h4>
      <p>$${producto.precio.toLocaleString()} x ${producto.cantidad}</p>
      <div class="controles">
        <button onclick="disminuirCantidad(${indice})">-</button>
        <strong>${producto.cantidad}</strong>
        <button onclick="aumentarCantidad(${indice})">+</button>
      </div>
    `;

    lista.appendChild(elemento);
  });

  calcularTotal();
}

// ------------------------------------
// AUMENTAR CANTIDAD
// ------------------------------------
function aumentarCantidad(indice) {
  carrito[indice].cantidad++;
  actualizarCarrito();
}

// ------------------------------------
// DISMINUIR CANTIDAD
// ------------------------------------
function disminuirCantidad(indice) {
  carrito[indice].cantidad--;
  if (carrito[indice].cantidad <= 0) {
    carrito.splice(indice, 1);
  }
  actualizarCarrito();
}

// ------------------------------------
// CALCULAR TOTAL
// ------------------------------------
function calcularTotal() {
  let total = 0;
  let cantidad = 0;

  carrito.forEach(producto => {
    total += producto.precio * producto.cantidad;
    cantidad += producto.cantidad;
  });

  document.getElementById("total").textContent = total.toLocaleString();
  document.getElementById("cantidadProductos").textContent = cantidad;
}

// ------------------------------------
// VACIAR CARRITO
// ------------------------------------
function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

// ------------------------------------
// REALIZAR PEDIDO
// ------------------------------------
function realizarPedido() {
  if (carrito.length === 0) {
    alert("Agregue productos antes de realizar el pedido.");
    return;
  }

  let mensaje = "🔊🛠️ XOLO SOUND & HERRAMIENTAS\n\nResumen del pedido:\n\n";

  carrito.forEach(producto => {
    mensaje += `- ${producto.nombre} (x${producto.cantidad}): $${(producto.precio * producto.cantidad).toLocaleString()}\n`;
  });

  let totalFinal = document.getElementById("total").textContent;
  mensaje += `\nTotal a pagar: $${totalFinal} MXN\n\n¡Gracias por su preferencia!`;

  alert(mensaje);
  vaciarCarrito();
}

// ------------------------------------
// FILTRAR MENÚ POR CATEGORÍA
// ------------------------------------
function filtrarMenu(categoria) {
  const productos = document.querySelectorAll(".producto");

  productos.forEach(producto => {
    if (categoria === 'todos' || producto.classList.contains(categoria)) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
}

// ------------------------------------
// BUSCADOR EN TIEMPO REAL
// ------------------------------------
function buscarProducto() {
  const texto = document.getElementById("buscar").value.toLowerCase();
  const productos = document.querySelectorAll(".producto");

  productos.forEach(producto => {
    const nombre = producto.querySelector("h2").textContent.toLowerCase();
    const descripcion = producto.querySelector("p").textContent.toLowerCase();

    if (nombre.includes(texto) || descripcion.includes(texto)) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
}
