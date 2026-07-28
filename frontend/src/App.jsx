import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const App = () => {
    const [vistaActiva, setVistaActiva] = useState('tienda'); // 'tienda' o 'admin'
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({
        sku: '', nombre: '', precio_base: '', stock_inicial: ''
    });

    const API_URL = 'http://localhost:8000/api';

    // ==========================================
    // LOGICA CENTRAL
    // ==========================================
    const cargarDatos = async () => {
        try {
            const respuesta = await axios.get(`${API_URL}/catalog`);
            setProductos(respuesta.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // ==========================================
    // LOGICA DEL CARRITO Y TIENDA
    // ==========================================
    const agregarAlCarrito = (producto) => {
        const itemExistente = carrito.find(item => item.sku === producto.sku);
        const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;

        if (cantidadActualEnCarrito + 1 > producto.stock_postgres) {
            Swal.fire('Stock Insuficiente', `Solo hay ${producto.stock_postgres} unidades disponibles.`, 'warning');
            return;
        }

        if (itemExistente) {
            setCarrito(carrito.map(item => 
                item.sku === producto.sku ? { ...item, cantidad: item.cantidad + 1 } : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Agregado al carrito', showConfirmButton: false, timer: 1000 });
    };

    const quitarDelCarrito = (sku) => {
        setCarrito(carrito.filter(item => item.sku !== sku));
    };

    const procesarCheckout = async () => {
        if (carrito.length === 0) return;

        Swal.fire({
            title: 'Procesando compra...',
            text: 'Validando inventario distribuido',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            // Procesamos cada item del carrito y actualizamos el backend (que a su vez sincroniza Mongo)
            for (const item of carrito) {
                const stockRestante = item.stock_postgres - item.cantidad;
                await axios.put(`${API_URL}/inventario/${item.sku}`, { cantidad: stockRestante });
            }
            
            Swal.fire('¡Compra Exitosa!', 'El inventario ha sido descontado y sincronizado.', 'success');
            setCarrito([]); // Vaciamos carrito
            cargarDatos();  // Refrescamos tienda
        } catch (error) {
            Swal.fire('Error en Checkout', 'Hubo un problema sincronizando la venta.', 'error');
        }
    };

    // ==========================================
    // LOGICA DEL ADMIN
    // ==========================================
    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/productos`, nuevoProducto);
            Swal.fire({ title: '¡Éxito!', text: 'Producto sincronizado', icon: 'success', timer: 2000, showConfirmButton: false });
            setNuevoProducto({ sku: '', nombre: '', precio_base: '', stock_inicial: '' });
            cargarDatos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el producto.', 'error');
        }
    };

    const actualizarStockAdmin = async (sku, stockActual, cantidadASumar) => {
        if (stockActual + cantidadASumar < 0) return;
        try {
            await axios.put(`${API_URL}/inventario/${sku}`, { cantidad: stockActual + cantidadASumar });
            cargarDatos();
        } catch (error) {
            Swal.fire('Error', 'Fallo al actualizar.', 'error');
        }
    };

    const eliminarProducto = (sku) => {
        Swal.fire({
            title: '¿Eliminar?', text: `Se borrará el SKU: ${sku}`, icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${API_URL}/productos/${sku}`);
                cargarDatos();
            }
        });
    };

    // ==========================================
    // RENDERIZADO CONDICIONAL (VISTAS)
    // ==========================================
    const renderTienda = () => {
        // REGLA DE NEGOCIO: Solo productos sincronizados y con stock
        const productosDisponibles = productos.filter(p => 
            p.estado_sincronizacion === 'Sincronizado 🟢' && p.stock_postgres > 0
        );

        const totalCarrito = carrito.reduce((total, item) => total + (item.cantidad), 0);

        return (
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productosDisponibles.length === 0 ? (
                        <p className="text-gray-500 italic col-span-full">No hay productos disponibles para la venta en este momento.</p>
                    ) : (
                        productosDisponibles.map(prod => (
                            <div key={prod.sku} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">
                                <div className="h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-4xl">
                                    {prod.nombre.includes('Laptop') ? '💻' : prod.nombre.includes('Phone') ? '📱' : prod.nombre.includes('Camiseta') ? '👕' : prod.nombre.includes('Auriculares') ? '🎧' : '🛍️'}
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{prod.nombre}</h3>
                                <p className="text-sm text-gray-500 mb-2">SKU: {prod.sku}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-green-600 text-lg">Disponible: {prod.stock_postgres}</span>
                                </div>
                                <button onClick={() => agregarAlCarrito(prod)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                                    🛒 Agregar al Carrito
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="md:w-1/4">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sticky top-6">
                        <h2 className="text-xl font-bold mb-4 flex justify-between items-center text-gray-800">
                            Tu Carrito <span>{totalCarrito > 0 && `(${totalCarrito})`}</span>
                        </h2>
                        
                        {carrito.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">El carrito está vacío</p>
                        ) : (
                            <div className="space-y-4">
                                {carrito.map(item => (
                                    <div key={item.sku} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <p className="font-semibold text-sm line-clamp-1">{item.nombre}</p>
                                            <p className="text-xs text-gray-500">Cant: {item.cantidad}</p>
                                        </div>
                                        <button onClick={() => quitarDelCarrito(item.sku)} className="text-red-500 hover:text-red-700 text-sm font-bold px-2">
                                            X
                                        </button>
                                    </div>
                                ))}
                                <button onClick={procesarCheckout} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4 shadow-lg transition">
                                    💳 Finalizar Compra
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderAdmin = () => (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Sincronizar Nuevo Producto</h2>
                <form onSubmit={crearProducto} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input type="text" placeholder="SKU (Ej: CAP-01)" required value={nuevoProducto.sku} onChange={e => setNuevoProducto({...nuevoProducto, sku: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" placeholder="Nombre del Producto" required value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2" />
                    <input type="number" step="0.01" placeholder="Precio ($)" required value={nuevoProducto.precio_base} onChange={e => setNuevoProducto({...nuevoProducto, precio_base: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="number" placeholder="Stock Inicial" required value={nuevoProducto.stock_inicial} onChange={e => setNuevoProducto({...nuevoProducto, stock_inicial: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <button type="submit" className="md:col-span-5 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded shadow transition">
                        ➕ Guardar en SQL y NoSQL
                    </button>
                </form>
            </div>

            {/* Tabla Admin */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full">
                <div className="overflow-x-auto w-full"> 
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Producto</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Stock (Mongo)</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Stock (Postgres)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productos.map((prod) => (
                                <tr key={prod.sku} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{prod.sku}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{prod.nombre}</td>
                                    <td className="px-4 py-3 whitespace-nowrap font-bold text-blue-600 text-center">{prod.stock_mongo}</td>
                                    <td className="px-4 py-3 whitespace-nowrap font-bold text-blue-600 text-center">{prod.stock_postgres}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {prod.estado_sincronizacion === 'Sincronizado 🟢' ? (
                                            <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">Sincronizado</span>
                                        ) : (
                                            <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">Desfasado</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                            <button onClick={() => actualizarStockAdmin(prod.sku, prod.stock_postgres, 10)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs">📦 +10</button>
                                            <button onClick={() => actualizarStockAdmin(prod.sku, prod.stock_postgres, -1)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-xs">🛒 -1</button>
                                            <button onClick={() => eliminarProducto(prod.sku)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs">🗑️ Del</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white shadow-sm border-b px-4 py-3 mb-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl text-blue-600">BBD-<span className="text-gray-800">Commerce</span></div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setVistaActiva('tienda')}
                            className={`px-4 py-2 rounded-md transition ${vistaActiva === 'tienda' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            🛍️ Tienda
                        </button>
                        <button 
                            onClick={() => setVistaActiva('admin')}
                            className={`px-4 py-2 rounded-md transition ${vistaActiva === 'admin' ? 'bg-gray-800 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            ⚙️ Panel Admin
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenedor Principal */}
            <main className="max-w-7xl mx-auto px-4 pb-12">
                {vistaActiva === 'tienda' ? renderTienda() : renderAdmin()}
            </main>
        </div>
    );
};

export default App;