import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaExito, alertaError, confirmarAccion } from '../utils/alertas';

export default function Articulos() {
    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    // Estado del formulario
    const [form, setForm] = useState({ id: null, nombre: '', precioUnitario: 0 });
    const [editando, setEditando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Cargo articulos desde la API
    const cargarArticulos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Articulos');
            setArticulos(res.data);
        } catch (err) {
            alertaError('No se pudieron cargar los artículos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarArticulos();
    }, []);

    // KPIs calculados
    const totalArticulos = articulos.length;
    // Suma de todos los precios
    const sumaTotalPrecios = articulos.reduce((acc, a) => acc + Number(a.precioUnitario || a.precio || 0), 0);

    // Filro de busqueda por nombre
    const articulosFiltrados = articulos.filter(a => {
        const query = busqueda.toLowerCase();
        const nombre = (a.nombre || a.descripcion || '').toLowerCase();
        return nombre.includes(query);
    });

    // Modal
    const abrirNuevo = () => {
        setForm({ id: null, nombre: '', precioUnitario: 0 });
        setEditando(false);
        setMostrarModal(true);
    };

    const iniciarEdicion = (art) => {
        setForm({
            id: art.id || art.idArticulo,
            nombre: art.nombre || art.descripcion || '',
            precioUnitario: art.precioUnitario || art.precio || 0
        });
        setEditando(true);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setForm({ id: null, nombre: '', precioUnitario: 0 });
        setEditando(false);
        setMostrarModal(false);
    };

    // Guardar / editar
    const guardar = async (e) => {
        e.preventDefault();

        if (!form.nombre.trim()) {
            alertaError('Ingresa la descripción o nombre del artículo');
            return;
        }

        try {
            const payload = {
                id: form.id ? Number(form.id) : undefined,
                nombre: form.nombre,
                descripcion: form.nombre,
                precioUnitario: Number(form.precioUnitario),
                precio: Number(form.precioUnitario)
            };

            if (editando) {
                await api.put(`/Articulos/${form.id}`, payload);
                alertaExito('Artículo actualizado correctamente');
            } else {
                await api.post('/Articulos', payload);
                alertaExito('Artículo registrado correctamente');
            }
            cerrarModal();
            cargarArticulos();
        } catch (err) {
            alertaError('Ocurrió un error al guardar el artículo');
        }
    };

    // Eliminar
    const eliminar = async (art) => {
        const idEliminar = art.id || art.idArticulo;
        const confirmado = await confirmarAccion(
            '¿Eliminar artículo?',
            `Se eliminará "${art.nombre || art.descripcion}" del inventario`
        );

        if (confirmado) {
            try {
                await api.delete(`/Articulos/${idEliminar}`);
                alertaExito('Artículo eliminado correctamente');
                cargarArticulos();
            } catch (err) {
                alertaError('No se pudo eliminar el artículo');
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ padding: '24px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            {/* REPORTE */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background-color: white !important; }
                    .print-area { box-shadow: none !important; border: none !important; padding: 0 !important; }
                    table { width: 100% !important; border-collapse: collapse !important; }
                    th, td { border: 1px solid #cbd5e1 !important; padding: 10px !important; font-size: 11pt !important; }
                }
            `}</style>

            {/* ENCABEZADO */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '700' }}>
                        Inventario de Artículos e Insumos
                    </h1>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Planta de Purificación y Embotellado - PEÑA DE HOREB
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            backgroundColor: '#0284c7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
                        }}
                    >
                        🖨️ Imprimir Reporte
                    </button>
                    <button
                        onClick={abrirNuevo}
                        style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
                        }}
                    >
                        + Nuevo Artículo
                    </button>
                </div>
            </div>

            {/* Tarjeta con precios del inventario */}
            <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #0284c7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Artículos</span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#0f172a', fontWeight: '700' }}>{totalArticulos}</h3>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Suma Total del Inventario</span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#16a34a', fontWeight: '700' }}>
                        ${sumaTotalPrecios.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            {/* Barra de busqueda */}
            <div className="no-print" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder="🔍 Buscar por artículo..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    />
                </div>
                <button
                    onClick={cargarArticulos}
                    style={{
                        backgroundColor: '#e2e8f0',
                        color: '#334155',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Recargar Datos
                </button>
            </div>

            {/* Modal para guardar / editar */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>{editando ? 'Editar Artículo' : 'Nuevo Artículo'}</h3>
                        
                        <form onSubmit={guardar}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Descripción / Artículo:</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Jabón"
                                        value={form.nombre}
                                        onChange={e => setForm({...form, nombre: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Precio Unitario ($):</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={form.precioUnitario}
                                        onChange={e => setForm({...form, precioUnitario: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={cerrarModal} style={{ background: '#cbd5e1', color: '#334155', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                    Cancelar
                                </button>
                                <button type="submit" style={{ background: '#0284c7', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                    {editando ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla de datos */}
            <div className="print-area" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700' }}>DESCRIPCIÓN / ARTÍCULO</th>
                            <th style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700', textAlign: 'right' }}>PRECIO UNIT.</th>
                            <th className="no-print" style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#0284c7', fontWeight: '600' }}>
                                    Cargando artículos desde la base de datos...
                                </td>
                            </tr>
                        ) : articulosFiltrados.length > 0 ? (
                            articulosFiltrados.map(art => {
                                const id = art.id || art.idArticulo;
                                const nombre = art.nombre || art.descripcion;
                                const precio = art.precioUnitario || art.precio || 0;

                                return (
                                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                            {nombre}
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                                            ${Number(precio).toFixed(2)}
                                        </td>
                                        <td className="no-print" style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={() => iniciarEdicion(art)}
                                                    style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => eliminar(art)}
                                                    style={{ background: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px', fontSize: '14px' }}>
                                    No hay artículos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}