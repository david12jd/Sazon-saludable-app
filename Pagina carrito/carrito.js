// carrito.js

// Recuperar productos desde localStorage
function obtenerProductosCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

// Guardar productos en localStorage
function guardarProductosCarrito(productos) {
  localStorage.setItem('carrito', JSON.stringify(productos));
}

// Eliminar un producto por nombre
function eliminarProducto(nombre) {
  let productos = obtenerProductosCarrito();
  productos = productos.filter(producto => producto.nombre !== nombre);
  guardarProductosCarrito(productos);
  renderizarCarrito();
}

// Calcular y mostrar el total
function calcularTotal(productos) {
  return productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
}

// Renderizar todos los productos en el resumen
function renderizarCarrito() {
  const contenedor = document.getElementById('productos-carrito');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  contenedor.innerHTML = '';

  const productos = obtenerProductosCarrito();
  let subtotal = 0;

  productos.forEach(producto => {
    const productoHTML = document.createElement('div');
    productoHTML.className = 'product';
    productoHTML.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="product-info">
        <h3>${producto.nombre}</h3>
        <p>Id_producto ${producto.id_plato || ''}</p>
        <span>$<span class="price">${producto.precio}</span></span>
      </div>
      <div class="actions">
        <button class="delete-btn" data-nombre="${producto.nombre}">Eliminar</button>
        <select class="quantity-selector" data-nombre="${producto.nombre}">
          ${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${n === producto.cantidad ? 'selected' : ''}>${n} pzs</option>`).join('')}
        </select>
      </div>
    `;
    contenedor.appendChild(productoHTML);

    subtotal += producto.precio * producto.cantidad;
  });

  subtotalEl.textContent = subtotal;
  totalEl.textContent = subtotal; // Envío gratis

  // Agregar eventos para eliminar
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nombre = e.target.dataset.nombre;
      eliminarProducto(nombre);
    });
  });

  // Agregar eventos para cambiar cantidad
  document.querySelectorAll('.quantity-selector').forEach(select => {
    select.addEventListener('change', (e) => {
      const nombre = e.target.dataset.nombre;
      const nuevaCantidad = parseInt(e.target.value);
      const productos = obtenerProductosCarrito();
      const producto = productos.find(p => p.nombre === nombre);
      if (producto) {
        producto.cantidad = nuevaCantidad;
        guardarProductosCarrito(productos);
        renderizarCarrito();
      }
    });
  });
}

// Ejecutar cuando cargue la página
window.addEventListener('DOMContentLoaded', renderizarCarrito);
