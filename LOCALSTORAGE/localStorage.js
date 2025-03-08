// Variables globales
const d = document;
let nombrePro = d.querySelector("#nombrePro");
let precioPro = d.querySelector("#precioPro");
let imagenPro = d.querySelector("#imagenPro");
let descripcionPro = d.querySelector("#descripcionPro");
let btnGuardar = d.querySelector(".btnGuardar");
let tabla = d.querySelector(".table > tbody");
let searchInput = d.querySelector("#searchInput"); // Input de búsqueda
let btnExportarPDF = d.querySelector("#btnExportarPDF"); // Botón para exportar a PDF

// Variable para manejar edición
let editIndex = null;

// Validar datos del formulario
btnGuardar.addEventListener("click", () => {
    if (editIndex === null) {
        ValidarDatos();
    } else {
        actualizarProducto();
    }
    mostrarDatos();
});

d.addEventListener("DOMContentLoaded", () => {
    mostrarDatos();
});

function ValidarDatos() {
    if (nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
        let producto = {
            nombre: nombrePro.value,
            precio: precioPro.value,
            imagen: imagenPro.value,
            descripcion: descripcionPro.value
        };
        guardarDatos(producto);
    } else {
        alert("Todos los campos son Obligatorios");
    }
    limpiarFormulario();
}

function guardarDatos(pro) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(pro);
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto guardado con éxito");
}

function mostrarDatos() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    tabla.innerHTML = '';
    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" width="50"></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${i})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
    filtrarProductos();
}

function editarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos[index];
    nombrePro.value = producto.nombre;
    precioPro.value = producto.precio;
    imagenPro.value = producto.imagen;
    descripcionPro.value = producto.descripcion;
    editIndex = index;
    btnGuardar.textContent = "Actualizar";
}

function actualizarProducto() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos[editIndex] = {
        nombre: nombrePro.value,
        precio: precioPro.value,
        imagen: imagenPro.value,
        descripcion: descripcionPro.value
    };
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto actualizado con éxito");
    editIndex = null;
    btnGuardar.textContent = "Guardar";
    limpiarFormulario();
}

function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto eliminado con éxito");
    mostrarDatos();
}

function limpiarFormulario() {
    nombrePro.value = "";
    precioPro.value = "";
    imagenPro.value = "";
    descripcionPro.value = "";
}

function filtrarProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const searchTerm = searchInput.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(searchTerm));
    mostrarProductosFiltrados(productosFiltrados);
}

function mostrarProductosFiltrados(productos) {
    tabla.innerHTML = '';
    productos.forEach((producto, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen}" width="50"></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${i})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

searchInput.addEventListener("input", filtrarProductos);

// Función para exportar a PDF
btnExportarPDF.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("Listado de Productos", 14, 20);

    doc.setFontSize(12);
    doc.text("No", 14, 30);
    doc.text("Nombre", 30, 30);
    doc.text("Precio", 90, 30);
    doc.text("Descripción", 120, 30);
    doc.text("Imagen", 160, 30);

    let y = 40;
    productos.forEach((producto, index) => {
        doc.text((index + 1).toString(), 14, y);
        doc.text(producto.nombre, 30, y);
        doc.text(producto.precio.toString(), 90, y);
        doc.text(producto.descripcion, 120, y);
        doc.text(producto.imagen, 160, y);
        y += 10;
    });

    doc.save("productos.pdf");
});
