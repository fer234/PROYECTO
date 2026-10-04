import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, Cpu, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Inicio() {
    const [stats, setStats] = useState({ usuarios: 0, articulos: 0, produccion: 0 });

    useEffect(() => {
        const cargarMetricas = async () => {
            try {
                const [resU, resA, resP] = await Promise.all([
                    api.get('/Usuarios'),
                    api.get('/Articulos'),
                    api.get('/Produccion')
                ]);
                setStats({
                    usuarios: resU.data.length,
                    articulos: resA.data.length,
                    produccion: resP.data.length
                });
            } catch (err) {
                console.error("Error al cargar métricas", err);
            }
        };
        cargarMetricas();
    }, []);

    return (
        <div className="main-container" style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#1e293b', fontSize: '28px', marginBottom: '8px', letterSpacing: '1px' }}>BIENVENIDOS</h1>
            <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '15px' }}>Panel de Control General del Sistema Empresarial</p>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '25px', 
                marginTop: '20px' 
            }}>
                {/* Tarjeta de Usuarios */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: '#334155', fontSize: '18px' }}>Usuarios</h3>
                        <Users size={24} color="#6366f1" />
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>{stats.usuarios}</p>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Registrados en el sistema</p>
                    <Link to="/usuarios" style={linkCardStyle}>
                        Gestionar Usuarios <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Tarjeta de Artículos */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: '#334155', fontSize: '18px' }}>Artículos</h3>
                        <Package size={24} color="#10b981" />
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>{stats.articulos}</p>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Inventario activo</p>
                    <Link to="/articulos" style={linkCardStyle}>
                        Gestionar Artículos <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Tarjeta de Producción */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: '#334155', fontSize: '18px' }}>Producción</h3>
                        <Cpu size={24} color="#f59e0b" />
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>{stats.produccion}</p>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Lotes registrados</p>
                    <Link to="/produccion" style={linkCardStyle}>
                        Ver Producción <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'left',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    transition: 'transform 0.2s',
};

const linkCardStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px'
};