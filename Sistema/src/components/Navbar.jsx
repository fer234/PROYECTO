import React, { useState, useEffect } from 'react';

export default function Navbar() {
    const [usuario, setUsuario] = useState({ nombre: 'Usuario', apellido: 'Sistema' });

    useEffect(() => {
        const usuarioRaw = localStorage.getItem('usuario') || localStorage.getItem('user') || '{}';
        try {
            const data = JSON.parse(usuarioRaw);
            const nombre = data?.nombre || data?.Nombre || 'Usuario';
            const apellido = data?.apellido || data?.Apellido || '';
            setUsuario({ nombre, apellido });
        } catch (e) {
            setUsuario({ nombre: 'Usuario', apellido: 'Activo' });
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const modulos = [
        { nombre: 'Usuarios', ruta: '/usuarios', icono: '👥' },
        { nombre: 'Artículos', ruta: '/articulos', icono: '📦' },
        { nombre: 'Producción', ruta: '/produccion', icono: '⚙️' },
    ];

    return (
        <header style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '10px 28px',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.25)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            fontFamily: "'Segoe UI', Roboto, -apple-system, sans-serif"
        }}>
            {/* Aqui se configura el encabezado del reporte */}
            <style>{`
                @media print {
                    header {
                        background: none !important;
                        box-shadow: none !important;
                        border-bottom: 2px solid #cbd5e1 !important;
                        padding: 10px 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-title {
                        color: #1e293b !important;
                        -webkit-text-fill-color: initial !important;
                    }
                }
            `}</style>

            <div style={{
                maxWidth: '100%',
                margin: '0 auto',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                gap: '20px'
            }}>

                <a 
                    href="/" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        textDecoration: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)',
                        fontSize: '18px'
                    }}>
                        💧
                    </div>
                    <div>
                        <div className="print-title" style={{
                            fontSize: '17px',
                            fontWeight: '800',
                            letterSpacing: '0.4px',
                            background: 'linear-gradient(90deg, #ffffff, #cbd5e1)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Sistema PEÑA DE HOREB
                        </div>
                        <div style={{
                            fontSize: '10px',
                            color: '#64748b',
                            fontWeight: '600',
                            letterSpacing: '0.3px',
                            textTransform: 'uppercase'
                        }}>
                            Planta de Purificación y Embotellado
                        </div>
                    </div>
                </a>
                <nav className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {modulos.map((mod) => {
                        const esActivo = window.location.pathname.toLowerCase() === mod.ruta.toLowerCase();
                        return (
                            <a
                                key={mod.nombre}
                                href={mod.ruta}
                                style={{
                                    textDecoration: 'none',
                                    color: esActivo ? '#38bdf8' : '#cbd5e1',
                                    backgroundColor: esActivo ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                                    border: esActivo ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: esActivo ? '700' : '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{mod.icono}</span>
                                <span>{mod.nombre}</span>
                            </a>
                        );
                    })}
                </nav>

                <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
                    

                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#f87171',
                            border: '1px solid rgba(248, 113, 113, 0.3)',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Salir
                    </button>
                </div>

            </div>
        </header>
    );
}