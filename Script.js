const productos = [

{
nombre:"Pioneer TS-A6970F",
categoria:"audio",
estado:"nuevo",
icono:"🔊",
precio:1250
},

{
nombre:"Subwoofer JBL Stage 1220",
categoria:"audio",
estado:"nuevo",
icono:"🔊",
precio:2600
},

{
nombre:"Pantalla Android 10 Pulgadas",
categoria:"pantalla",
estado:"nuevo",
icono:"📺",
precio:4200
},

{
nombre:"Amplificador Pioneer GM",
categoria:"audio",
estado:"nuevo",
icono:"⚡",
precio:3500
},

{
nombre:"Kicker CompR 12",
categoria:"audio",
estado:"seminuevo",
icono:"🔊",
precio:1800
},

{
nombre:"Kenwood 1000W",
categoria:"audio",
estado:"seminuevo",
icono:"⚡",
precio:2200
},

{
nombre:"Pantalla Android Usada",
categoria:"pantalla",
estado:"seminuevo",
icono:"📺",
precio:2100
},

{
nombre:"Taladro Milwaukee",
categoria:"herramienta",
estado:"seminuevo",
icono:"🛠️",
precio:1800
}

];

let carrito = [];
let listaActual = [...productos];

function render(lista){

    const catalogo =
    document.getElementById("catalogo");

    catalogo.innerHTML="";

    lista.forEach(producto=>{

        catalogo.innerHTML += `

        <div class="producto">

            <span class="estado ${producto.estado}">
                ${producto.estado.toUpperCase()}
            </span>

            <div class="icono">
                ${producto.icono}
            </div>

            <h3>${producto.nombre}</h3>

            <p>
                Categoría:
                ${producto.categoria}
            </p>

            <span class="precio">
                $${producto.precio}
            </span>

            <button
            onclick="agregarCarrito(
            '${producto.nombre}',
            ${producto.precio}
            )">
            Agregar al carrito
            </button>

        </div>
        `;
    });

}

function buscarProducto(){

    const texto =
    document.getElementById("busqueda")
    .value.toLowerCase();

    listaActual =
    productos.filter(producto =>
        producto.nombre
        .toLowerCase()
        .includes(texto)
    );

    render(listaActual);
}

function filtrarCategoria(){

    const categoria =
    document.getElementById("categoria")
    .value;

    if(categoria==="todos"){

        listaActual = [...productos];
    }

    else{

        listaActual = productos.filter(producto =>

        producto.categoria===categoria ||

        producto.estado===categoria

        );
    }

    render(listaActual);
}

function ordenPrecioAsc(){

    listaActual.sort(
        (a,b)=>a.precio-b.precio
    );

    render(listaActual);
}

function ordenPrecioDesc(){

    listaActual.sort(
        (a,b)=>b.precio-a.precio
    );

    render(listaActual);
}

function ordenNombre(){

    listaActual.sort(
        (a,b)=>
        a.nombre.localeCompare(b.nombre)
    );

    render(listaActual);
}

function agregarCarrito(nombre,precio){

    carrito.push({
        nombre,
        precio
    });

    actualizarCarrito();
}

function actualizarCarrito(){

    const lista =
    document.getElementById("listaCarrito");

    lista.innerHTML="";

    let total = 0;

    carrito.forEach(item=>{

        total += item.precio;

        lista.innerHTML +=
        `<li>${item.nombre} - $${item.precio}</li>`;
    });

    document.getElementById("total")
    .innerText =
    `Total: $${total}`;
}

render(productos);

