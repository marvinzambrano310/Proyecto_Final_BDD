import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const App = () => {
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({
        sku: '', nombre: '', precio_base: '', stock_inicial: ''
    });

    const API_URL = 'http://localhost:8000/api';

    const cargarDatos = async () => {
        try {
            const respuesta = await axios.get(`${API_URL}/catalog`);
            setProductos(respuesta.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos de los servidores.', 'error');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/productos`, nuevoProducto);
            Swal.fire({ title: '¡Éxito!', text: 'Producto sincronizado', icon: 'success', timer: 2500, showConfirmButton: false });
            setNuevoProducto({ sku: '', nombre: '', precio_base: '', stock_inicial: '' });
            cargarDatos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el producto.', 'error');
        }
    };

    const simularCompra = async (sku, stockActual) => {
        if (stockActual <= 0) {
            Swal.fire('Sin Stock', 'No hay unidades disponibles para vender.', 'warning');
            return;
        }
        try {
            const nuevoStock = stockActual - 1;
            await axios.put(`${API_URL}/inventario/${sku}`, { cantidad: nuevoStock });
            Swal.fire({ 
              toast: true, 
              position: 'top-end', 
              icon: 'success', 
              title: 'Venta registrada', 
              showConfirmButton: false, 
              timer: 2000 
            });
            cargarDatos();
        } catch (error) {
            Swal.fire('Error', 'Fallo al procesar la venta.', 'error');
        }
    };

    const eliminarProducto = (sku) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará el SKU: ${sku}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/productos/${sku}`);
                    Swal.fire('¡Eliminado!', 'Borrado de PostgreSQL y MongoDB.', 'success');
                    cargarDatos();
                } catch (error) {
                    Swal.fire('Error', 'Problema al eliminar.', 'error');
                }
            }
        });
    };

    const reabastecerStock = async (sku, stockActual) => {
        try {
            const nuevoStock = stockActual + 10;
            await axios.put(`${API_URL}/inventario/${sku}`, { cantidad: nuevoStock });
            
            Swal.fire({ 
                toast: true, 
                position: 'top-end', 
                icon: 'info', 
                title: '📦 Inventario reabastecido (+10)', 
                showConfirmButton: false, 
                timer: 2000 
            });
            cargarDatos();
        } catch (error) {
            Swal.fire('Error', 'Fallo al reabastecer inventario.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Adaptable */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">E-Commerce Admin</h1>
                        <p className="text-sm md:text-base text-gray-500 mt-1">Gestión de Bases de Datos Distribuidas (PostgreSQL + MongoDB)</p>
                    </div>
                    <button onClick={cargarDatos} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition flex items-center justify-center gap-2">
                        <span>🔄</span> Refrescar Tablero
                    </button>
                </div>

                {/* Formulario */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Crear Nuevo Producto</h2>
                    <form onSubmit={crearProducto} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        <input type="text" placeholder="SKU (Ej: CAP-01)" required value={nuevoProducto.sku} onChange={e => setNuevoProducto({...nuevoProducto, sku: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full" />
                        <input type="text" placeholder="Nombre del Producto" required value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:col-span-2 md:col-span-2" />
                        <input type="number" step="0.01" placeholder="Precio ($)" required value={nuevoProducto.precio_base} onChange={e => setNuevoProducto({...nuevoProducto, precio_base: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full" />
                        <input type="number" placeholder="Stock Inicial" required value={nuevoProducto.stock_inicial} onChange={e => setNuevoProducto({...nuevoProducto, stock_inicial: e.target.value})} className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full" />
                        
                        <button type="submit" className="sm:col-span-2 md:col-span-5 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition mt-2 w-full">
                            ➕ Sincronizar Producto en Motores de BDD
                        </button>
                    </form>
                </div>

                {/* Tabla Responsive con Scroll Horizontal */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full">
                    {/* El overflow-x-auto permite hacer scroll en móviles sin romper el diseño */}
                    <div className="overflow-x-auto w-full"> 
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Producto</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Stock (Mongo)</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Stock (Postgres)</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado Sinc.</th>
                                    <th className="px-4 py-3 md:px-6 md:py-4 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productos.map((prod) => (
                                    <tr key={prod.sku} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap font-medium text-gray-900">{prod.sku}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-gray-700">{prod.nombre}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap font-bold text-blue-600 text-center">{prod.stock_mongo}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap font-bold text-blue-600 text-center">{prod.stock_postgres}</td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                            {prod.estado_sincronizacion === 'Sincronizado 🟢' ? (
                                                <span className="px-2 py-1 md:px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Sincronizado
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 md:px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Desfasado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm font-medium">
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                                <button onClick={() => reabastecerStock(prod.sku, prod.stock_postgres)} className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 py-1.5 px-3 rounded shadow transition whitespace-nowrap">
                                                    📦 Abastecer
                                                </button>
                                                
                                                <button onClick={() => simularCompra(prod.sku, prod.stock_postgres)} className="w-full sm:w-auto text-white bg-yellow-500 hover:bg-yellow-600 py-1.5 px-3 rounded shadow transition whitespace-nowrap">
                                                    🛒 Vender
                                                </button>
                                                
                                                <button onClick={() => eliminarProducto(prod.sku)} className="w-full sm:w-auto text-white bg-red-500 hover:bg-red-600 py-1.5 px-3 rounded shadow transition whitespace-nowrap">
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default App;