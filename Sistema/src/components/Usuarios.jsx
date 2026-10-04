import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { alertaExito, alertaError } from '../utils/alertas';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ id: null, nombre: '', apellido: '', correo: '', password: '' });
    const [editando, setEditando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Usuarios');
            setUsuarios(res.data || []);
        } catch (err) {
            alertaError('No se pudieron cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const totalUsuarios = usuarios.length;

    const abrirNuevo = () => {
        setForm({ id: null, nombre: '', apellido: '', correo: '', password: '' });
        setEditando(false);
        setMostrarModal(true);
    };

    const iniciarEdicion = (usr) => {
        const correoObtenido = usr.correoElectronico || usr.correo || usr.email || usr.CorreoElectronico || usr.Correo || '';
        setForm({
            id: usr.id || usr.idUsuario || usr.IdUsuario,
            nombre: usr.nombre || usr.Nombre || '',
            apellido: usr.apellido || usr.Apellido || '',
            correo: correoObtenido,
            password: ''
        });
        setEditando(true);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setForm({ id: null, nombre: '', apellido: '', correo: '', password: '' });
        setEditando(false);
        setMostrarModal(false);
    };

    const guardar = async (e) => {
        e.preventDefault();

        if (!form.nombre.trim() || !form.apellido.trim() || !form.correo.trim()) {
            alertaError('Todos los campos son obligatorios');
            return;
        }

        try {
            const payload = {
                id: form.id ? Number(form.id) : undefined,
                nombre: form.nombre,
                apellido: form.apellido,
                correoElectronico: form.correo,
                correo: form.correo,
                email: form.correo
            };

            if (form.password) {
                payload.password = form.password;
            }

            if (editando) {
                await api.put(`/Usuarios/${form.id}`, payload);
                alertaExito('Usuario modificado correctamente');
            } else {
                await api.post('/Usuarios', payload);
                alertaExito('Usuario registrado correctamente');
            }
            cerrarModal();
            cargarUsuarios();
        } catch (err) {
            alertaError('Ocurrió un error al guardar el usuario');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ padding: '32px 24px', fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            <style>{`
                @media print {
                    .no-print, header, footer, nav, .footer-section { display: none !important; }
                    body { background-color: white !important; }
                    .print-area { box-shadow: none !important; border: none !important; padding: 0 !important; }
                    table { width: 100% !important; border-collapse: collapse !important; }
                    th, td { border: 1px solid #cbd5e1 !important; padding: 10px !important; font-size: 11pt !important; }
                }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', color: '#1e293b', fontWeight: '700' }}>
                            Mantenimiento de Usuarios
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            Planta de Purificación y Embotellado - PEÑA DE HOREB
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                                backgroundColor: '#6366f1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 18px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)'
                            }}
                        >
                            + Nuevo Registro
                        </button>
                    </div>
                </div>

                <div className="no-print" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'white', padding: '12px 20px', borderRadius: '8px', borderLeft: '4px solid #6366f1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TOTAL DE USUARIOS REGISTRADOS: </span>
                        <span style={{ fontSize: '16px', color: '#1e293b', fontWeight: '700', marginLeft: '6px' }}>{totalUsuarios}</span>
                    </div>
                </div>

                {mostrarModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>{editando ? 'Modificar Usuario' : 'Nuevo Usuario'}</h3>
                            
                            <form onSubmit={guardar}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Nombre:</label>
                                        <input
                                            type="text"
                                            value={form.nombre}
                                            onChange={e => setForm({...form, nombre: e.target.value})}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Apellido:</label>
                                        <input
                                            type="text"
                                            value={form.apellido}
                                            onChange={e => setForm({...form, apellido: e.target.value})}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Correo Electrónico:</label>
                                        <input
                                            type="email"
                                            value={form.correo}
                                            onChange={e => setForm({...form, correo: e.target.value})}
                                            required
                                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                                        />
                                    </div>

                                    {!editando && (
                                        <div>
                                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Contraseña:</label>
                                            <input
                                                type="password"
                                                value={form.password}
                                                onChange={e => setForm({...form, password: e.target.value})}
                                                required
                                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button type="button" onClick={cerrarModal} style={{ background: '#cbd5e1', color: '#334155', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                        Cancelar
                                    </button>
                                    <button type="submit" style={{ background: '#6366f1', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
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
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: '700' }}>Nombre</th>
                                <th style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: '700' }}>Apellido</th>
                                <th style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: '700' }}>Correo Electrónico</th>
                                <th className="no-print" style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#6366f1', fontWeight: '600' }}>
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : usuarios.length > 0 ? (
                                usuarios.map(usr => {
                                    const idItem = usr.id || usr.idUsuario || usr.IdUsuario;
                                    const nombreItem = usr.nombre || usr.Nombre || '';
                                    const apellidoItem = usr.apellido || usr.Apellido || '';
                                    const correoItem = usr.correoElectronico || usr.correo || usr.email || usr.CorreoElectronico || usr.Correo || usr.Email || '-';

                                    return (
                                        <tr key={idItem || nombreItem} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>
                                                {nombreItem}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>
                                                {apellidoItem}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1e293b' }}>
                                                {correoItem}
                                            </td>
                                            <td className="no-print" style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => iniciarEdicion(usr)}
                                                        style={{
                                                            backgroundColor: '#3b82f6',
                                                            color: 'white',
                                                            padding: '6px 14px',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        ✏️ Modificar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px', fontSize: '14px' }}>
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}