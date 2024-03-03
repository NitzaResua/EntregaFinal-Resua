// Declaración para cargar productos en el carrito
let carritoReceptor = [];

// LocalStorage
let carritoAlmacenado = localStorage.getItem("carrito");
if (carritoAlmacenado) {
  carritoReceptor = JSON.parse(carritoAlmacenado);
}

// Traer productos desde .json
let contenedor = document.getElementById("contenedor-productos");

const traerProductos = async () => {
  try {
    const response = await fetch("./products.json");
    const catalogo = await response.json();

    catalogo.forEach((item) => {
      const div = document.createElement("div");
      div.className = "productoDeCatalogo";
      div.innerHTML = `
      <h2>${item.productoNombre}</h2>
      <img src= ${item.productoImagen} class= imgProduct alt= ${item.productoNombre} style="width: auto; height:15rem">
      <h5>$${item.productoCosto}</h5>
      <button type="button" class = "btnAddProduct" value = ${item.productoId} >Agregar al carrito</button>
    `;
      contenedor.append(div);
    });

    // Función para agregar productos
    let botonAgregarAlCarrito =
    document.getElementsByClassName("btnAddProduct");
  for (let i = 0; i < botonAgregarAlCarrito.length; i++) {
    botonAgregarAlCarrito[i].addEventListener("click", (e) => {
      let productoIdEnCarrito = catalogo.filter(
        (ele) => ele.productoId == e.target.value
      );
      let identificadorId = uuid.v1();
      carritoReceptor.push({
        ...productoIdEnCarrito[0],
        identifier: identificadorId,
      });
      appendCart({ ...productoIdEnCarrito[0], identifier: identificadorId });
      pagoTotal(productoIdEnCarrito[0].productoCosto);

        // Actualización localStorage
        localStorage.setItem("carrito", JSON.stringify(carritoReceptor));
      });
    }
  } catch (error) {
    const div = document.createElement("div");
    div.innerHTML = `Error ${error}`;
    document.body.append(div);
  }
};

// LLamar a los productos
traerProductos();


let total = 0;

// Función agregar items al carrito
const appendCart = (item) => {

  let contenedorCarrito = document.getElementById("contenedor-carrito");
  let productoIdEnCarritoMini = document.createElement("div");
  productoIdEnCarritoMini.className = "productoIdEnCarritoMini";
  productoIdEnCarritoMini.id = item.identifier;
  productoIdEnCarritoMini.innerHTML = `
  <div class="card " style="max-width: 100%;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src=${item.productoImagen} class="img-fluid rounded-start imgProduct" alt=${item.productoNombre} >
    </div>
    <div class="col-md-7">
      <div class="card-body">
        <h5 class="card-title">${item.productoNombre}</h5>
        <p class="card-text">$${item.productoCosto}.00</p>
        <div id=${item.identifier}></div>
      </div>
    </div>
  </div>
</div>
`;
  // Contenedor 
  contenedorCarrito.append(productoIdEnCarritoMini);
  let botonBorrar = document.createElement("button");
  botonBorrar.id = "myButtonDelete";
  botonBorrar.className = "myButtonDeleteClass";
  botonBorrar.textContent = "Borrar";
  botonBorrar.addEventListener("click", () => {
    let borrarItem = carritoReceptor.filter(
      (ele) => ele.identifier !== item.identifier
    );
    carritoReceptor = borrarItem;


    // Actualiza localStorage
    localStorage.setItem("carrito", JSON.stringify(carritoReceptor));

    let getProduct = document.getElementById(item.identifier);
    getProduct.remove();
    pagoTotal(item.productoCosto * -1);
  });
  let contenedorBotonBorrar = document.getElementById(`${item.identifier}`);
  contenedorBotonBorrar.appendChild(botonBorrar);
};

window.addEventListener("load", () => {
  if (carritoReceptor.length > 0) {
    carritoReceptor.forEach((item) => {
      appendCart(item);
      pagoTotal(item.productoCosto);
    });
  }
});

// Ocultar el botón hasta que se agreguen productos al carrito
ocultarBtnFinalizar();

// Función para total
function pagoTotal(precio) {
  total = total + precio;
  let totalAgregado = document.getElementById("total");
  totalAgregado.textContent = `Cantidad: ${carritoReceptor.length} - Total a pagar: $${total}`;

  if (carritoReceptor.length > 0) {
    mostrarBtnFinalizar();
  } else {
    ocultarBtnFinalizar();
  }
}

// Finalizar compra
let btnFinalizar = document.getElementById("btnFinalizar");
btnFinalizar.addEventListener("click", () => {
  Swal.fire({
    title: "Gracias por comprar",
    text: `N° orden: ${Math.floor(
      Math.random() * 2000
    )} - El total de tu compra es $${total}`,
    icon: "success",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Finalizar",
    denyButtonText: `Regresar`,
  }).then((result) => {
    result.isConfirmed ? window.location.reload() : result.isDenied;
  });
  // Borar localStorage al finalizar la compra
  localStorage.clear();
});

// localStorage de usuario
let usuario = localStorage.getItem("usuario");
usuario && mostrarUsuario(usuario);

// Inicio sesión
function mostrarUsuario(usuario) {
  let infoUsuario = document.getElementById("infoUsuario");
  infoUsuario.textContent = `¡Bienvenido ${usuario}!`;

  localStorage.getItem("usuario") !== null
    ? ocultarbtnInicioSesion()
    : mostrarbtnInicioSesion();
}

// Botón de inicio de sesión
let btnInicioSesion = document.getElementById("btnInicioSesion");
btnInicioSesion.addEventListener("click", () => {
  Swal.fire({
    title: "Iniciar sesión",
    input: "text",
    inputPlaceholder: "Ingrese su usuario",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Iniciar Sesión",
    cancelButtonText: "Continuar sin iniciar sesión",
    preConfirm: (usuario) => {
      if (usuario) {
        localStorage.setItem("usuario", usuario);
        mostrarUsuario(usuario);

        btnInicioSesion.style.display = "none";
      }
    },
  });
});

// Botón "Finalizar compra"
function ocultarBtnFinalizar() {
  document.getElementById("btnFinalizar").style.display = `none`;
}

function mostrarBtnFinalizar() {
  document.getElementById("btnFinalizar").style.display = "block";
}

// Botón "Login/Iniciar Sesión"
function ocultarbtnInicioSesion() {
  document.getElementById("btnInicioSesion").style.display = `none`;
}

function mostrarbtnInicioSesion() {
  document.getElementById("btnInicioSesion").style.display = "block";
}
