import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { alertaExito, alertaError, confirmarAccion } from '../utils/alertas';

export default function Produccion() {
    const [produccion, setProduccion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('Todos');

    // Estado del formulario para crear/editar
    const [form, setForm] = useState({ id: null, fecha: '', tipo: '', estado: 'Activo' });
    const [editando, setEditando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Cargar registros desde la API
    const cargar = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Produccion');
            setProduccion(res.data);
        } catch (err) {
            alertaError('No se pudieron cargar los registros de entregas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        cargar(); 
    }, []);

    // Filtro 
    const entregasFiltradas = useMemo(() => {
        return produccion.filter((item) => {
            const clienteDetalle = item.tipo || '';
            const estado = item.estado || '';
            const fecha = item.fecha || '';

            const cumpleBusqueda =
                clienteDetalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fecha.toLowerCase().includes(searchTerm.toLowerCase());

            const cumpleEstado =
                selectedEstado === 'Todos' || estado.toLowerCase() === selectedEstado.toLowerCase();

            return cumpleBusqueda && cumpleEstado;
        });
    }, [produccion, searchTerm, selectedEstado]);

    // Tarjetas
    const totalEntregas = produccion.length;
    const activas = produccion.filter(p => p.estado?.toLowerCase() === 'activo').length;
    const inactivas = produccion.filter(p => p.estado?.toLowerCase() === 'inactivo').length;

    // Manejo de modal y formulario
    const abrirNuevo = () => {
        setForm({ id: null, fecha: new Date().toISOString().split('T')[0], tipo: '', estado: 'Activo' });
        setEditando(false);
        setMostrarModal(true);
    };

    const iniciarEdicion = (p) => {
        setForm({
            id: p.id,
            fecha: p.fecha ? p.fecha.split('T')[0] : '',
            tipo: p.tipo,
            estado: p.estado
        });
        setEditando(true);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setForm({ id: null, fecha: '', tipo: '', estado: 'Activo' });
        setEditando(false);
        setMostrarModal(false);
    };

    const guardar = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                const dataToUpdate = { 
                    id: Number(form.id),
                    fecha: form.fecha.split('T')[0], 
                    tipo: form.tipo, 
                    estado: form.estado 
                };
                await api.put(`/Produccion/${form.id}`, dataToUpdate);
                alertaExito('Entrega actualizada correctamente');
            } else {
                const dataToCreate = { 
                    fecha: form.fecha.split('T')[0], 
                    tipo: form.tipo, 
                    estado: form.estado 
                };
                await api.post('/Produccion', dataToCreate);
                alertaExito('Registro de entrega guardado correctamente');
            }
            cerrarModal();
            cargar();
        } catch (err) {
            alertaError('Verifica los datos ingresados');
        }
    };

    const eliminar = async (id) => {
        const confirmado = await confirmarAccion('¿Estás seguro?', 'Esta acción eliminará el registro de entrega');
        if (confirmado) {
            try {
                await api.delete(`/Produccion/${id}`);
                alertaExito('Registro eliminado');
                cargar();
            } catch (err) {
                alertaError('No se pudo eliminar el registro');
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ padding: '24px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background-color: white !important; }
                    .print-area { box-shadow: none !important; border: none !important; padding: 0 !important; }
                    table { width: 100% !important; border-collapse: collapse !important; }
                    th, td { border: 1px solid #cbd5e1 !important; padding: 8px !important; font-size: 11pt !important; }
                }
            `}</style>

            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '700' }}>
                        Control de Producción & Despacho
                    </h1>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        Gestión de entregas de garrafones y lotes - PEÑA DE HOREB
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
                            cursor: 'pointer'
                        }}
                    >
                        + Nueva Entrega
                    </button>
                </div>
            </div>

            <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #0284c7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Lotes / Registros</span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#0f172a' }}>{totalEntregas}</h3>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Entregas Activas</span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#16a34a' }}>{activas}</h3>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #dc2626', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Inactivas / Canceladas</span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#dc2626' }}>{inactivas}</h3>
                </div>
            </div>

            <div className="no-print" style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                    type="text"
                    placeholder="🔍 Buscar por cliente, detalle o fecha..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: '1',
                        minWidth: '280px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Estado:</label>
                    <select
                        value={selectedEstado}
                        onChange={(e) => setSelectedEstado(e.target.value)}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="Todos">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>

                    <button
                        onClick={cargar}
                        style={{
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        🔄 Recargar
                    </button>
                </div>
            </div>

            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>{editando ? 'Modificar Lote de Entrega' : 'Registrar Nuevo Despacho'}</h3>
                        
                        <form onSubmit={guardar}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Fecha de Programa/Entrega:</label>
                                    <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
                                </div>
                                
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Cliente / Detalle del Lote:</label>
                                    <input placeholder="Ej. Tienda Santa Marta - 50 Garrafones" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Estado:</label>
                                    <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
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

            <div className="print-area" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700' }}>FECHA</th>
                            <th style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700' }}>CLIENTE / DETALLE DE LOTE</th>
                            <th style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>ESTADO</th>
                            <th className="no-print" style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#0284c7' }}>
                                    Cargando entregas de la base de datos...
                                </td>
                            </tr>
                        ) : entregasFiltradas.length > 0 ? (
                            entregasFiltradas.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#0f172a' }}>
                                        {p.fecha ? p.fecha.split('T')[0] : ''}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                        {p.tipo}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 10px', 
                                            borderRadius: '12px', 
                                            fontSize: '12px', 
                                            fontWeight: '600',
                                            background: p.estado?.toLowerCase() === 'activo' ? '#dcfce7' : '#fee2e2',
                                            color: p.estado?.toLowerCase() === 'activo' ? '#166534' : '#991b1b'
                                        }}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="no-print" style={{ padding: '12px 16px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button onClick={() => iniciarEdicion(p)} style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                                Modificar
                                            </button>
                                            <button onClick={() => eliminar(p.id)} style={{ background: '#ef4444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px', fontSize: '14px' }}>
                                    No se encontraron registros que coincidan con la búsqueda "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}