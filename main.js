const productos = []; //Arreglo para guardar los productos de la tienda
const carrito = []; //Arreglo para guardar los productos añadidos al carrito
let totalCarrito = 0; //Precio total del carrito sin aplicar cuotas
let eleccionCuotas = true; //Para elegir cantidad de cuotas a abonar el carrito
let menuPrincipal = true; //Para inciar bucle

class Producto {
    constructor(id, nombre, cantidad, precio) {
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.vendido = false;
        this.precio = precio;
    }
    venderProducto() { //Para bajar la cantidad de stock que haya del producto y no se sobrevenda.
        if (this.cantidad > 0) {
            this.cantidad -= 1;
            this.vendido = true;
            return true;
        } else {
            return false;
        }
    }
}
//Agregado de productos
productos.push(new Producto(productos.length + 1, "biker", 2, 8000));
productos.push(new Producto(productos.length + 1, "top", 4, 6000));
productos.push(new Producto(productos.length + 1, "short", 8, 9000));
productos.push(new Producto(productos.length + 1, "remera", 20, 7000));

//Funciones
function buscarProducto (nombre){ //Funcion para encontrar el producto buscado por cliente
    const productoEncontrado = productos.find(producto => producto.nombre === nombre);
    if(productoEncontrado){
        alert(`
        El producto que desea buscar es el siguiente:
        Id: ${productoEncontrado.id}
        Nombre: ${productoEncontrado.nombre}
        Precio: $${productoEncontrado.precio}
        `)
        return productoEncontrado;
    } else {
        alert("Producto no encontrado.");
        return 1;
    }
}


function precioCuotas(totalCarrito, cuotas) { //Funcion para aplicar adicional por abonar en cuotas
    switch (cuotas) {
        case 1:
            precioFinal = totalCarrito;
            break;
        case 3:
            precioFinal = totalCarrito * 1.10;
            break;
        case 6:
            precioFinal = totalCarrito * 1.15;
            break;
    }
    precioFinal = Math.round(precioFinal);
}

const conversionProductos = (arregloPorductos) => { //Funcion para convertir los productos de la tienda a string y poder mostrarlos
    let stringProductos = "";
    for(const iterator of arregloPorductos){
        stringProductos += "\n" + "Id " + iterator.id + " -" + " Nombre " + iterator.nombre + " -" + " Precio " + iterator.precio;
    }
    return stringProductos;
}

//Inicio tienda
while (menuPrincipal) {
    let bienvenida = Number(prompt(`¡Bienvenido/a a la tienda Eleva Fit!

    Escriba el numero de la opción que desea:
    1- Ver pruductos disponibles 
    2- Buscar producto por nombre
    3- Filtrar productos por precio
    4- Ver carrito
    5- Finalizar compra
    6- Salir`));

    switch (bienvenida) {
        case 1: // Ver pruductos disponibles 
            const productosDisponibles = productos.filter(productos => productos.cantidad > 0); //Para mostrar solo los productos que tienen stock
            if (productosDisponibles.length > 0) {
                alert(`Los productos disponibles actualmente son:
                ${conversionProductos(productosDisponibles)}`);
                } else {
                    alert("No hay productos disponibles en este momento.");
                }
                break; 
        case 2: // Buscar producto por nombre
            do {
                const productoEncontrado = buscarProducto(prompt("Ingrese el nombre del producto que desea buscar").toLowerCase());
                if (productoEncontrado != 1) {
                    if (prompt('¿Deseas agregar el producto al carrito? (Si/No)').toLowerCase() === "si") {
                        const ventaExitosa = productoEncontrado.venderProducto();
                        if (ventaExitosa) {
                            carrito.push(productoEncontrado);
                            totalCarrito += productoEncontrado.precio;
                            alert("Producto agregado al carrito.");
                        } else {
                            alert("Producto no agregado al carrito por falta de stock");
                        }
                    } else {
                        alert("Producto no agregado al carrito.");
                        }
                }
                if (prompt('¿Desea buscar otro producto? (Si/No)').toLowerCase() !== 'si') {
                    break;
                }
            } while (true);
            break;
        case 3: //Filtrar productos por precio maximo
            const precioMaximo = Number(prompt("Ingrese el precio máximo para filtrar los productos"));
            const productosFiltrados = productos.filter(producto => producto.precio <= precioMaximo);
            if (productosFiltrados.length > 0) {
                alert(`Los productos que tienen un precio menor o igual a $${precioMaximo} son:
                ${productosFiltrados.map(producto => `Id: ${producto.id}, Nombre: ${producto.nombre}, Precio: $${producto.precio}`).join("\n")}`);
                if (prompt('¿Desea agregar alguno de estos productos al carrito? (Si/No)').toLowerCase() === 'si') {
                    const idAgregarProducto = Number(prompt("Ingrese el ID del producto que desea agregar al carrito"));
                    const agregarProducto = productos.find(producto => producto.id === idAgregarProducto);
                    if (agregarProducto && agregarProducto.precio <= precioMaximo) {
                        const ventaExitosa = agregarProducto.venderProducto();
                        if (ventaExitosa) {
                            carrito.push(agregarProducto);
                            totalCarrito += agregarProducto.precio;
                            alert("Producto agregado al carrito.");
                        } else {
                            alert("Producto no agregado al carrito por falta de stock");
                        }
                    } else {
                        alert("Producto no encontrado o con precio mayor.");
                    }
                }
            } else {
                alert(`Actualmente no contamos con productos de menor precio a $${precioMaximo}.`);
            }
            break;
            case 4: //Ver carrito
                if (carrito.length > 0) {
                    for (const productoCarrito of carrito) {
                        alert(`
                        Tu carrito contiene:
                        Id: ${productoCarrito.id}
                        Nombre: ${productoCarrito.nombre}
                        Precio: $${productoCarrito.precio}
                        `);
                    }
                    } else {
                    alert("Tu carrito está vacío.");
                    }
                    break;
        case 5: // Finalizar compra
            if (carrito.length > 0) {
                for (const productoCarrito of carrito) {
                    alert(`
                    Tu carrito contiene:
                    Id: ${productoCarrito.id}
                    Nombre: ${productoCarrito.nombre}
                    Precio: $${productoCarrito.precio}
                    `);
                }
                while (eleccionCuotas) {
                    cuotas = Number(prompt(
                        `
                        El total del carrito es: $${totalCarrito}.
                        Ingrese la cantidad de cuotas en las que deseas pagar:
                        •1 cuota sin interés
                        •3 cuotas con 10% de interés
                        •6 cuotas con 15% de interés`));
                    if (!(cuotas === 1 || cuotas === 3 || cuotas === 6)) {
                        alert("Cantidad de cuotas no válida");
                    } else {
                        precioCuotas(totalCarrito, cuotas);
                        eleccionCuotas = false;
                    }
                }
                alert(`El monto final a abonar es de $${precioFinal}`);
            } else {
                alert("No tienes productos en tu carrito.");
            }
            const continuarCompra = prompt('¿Desea hacer otra acción? (Si/No)').toLowerCase();
            menuPrincipal = continuarCompra === 'si';
            break;
        case 6: //Salir
            menuPrincipal = false;
            break;
        default:
            alert("Opción no válida");
            break;
    }
}




