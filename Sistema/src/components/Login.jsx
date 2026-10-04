import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import api from '../services/api';
import { alertaError, alertaExito } from '../utils/alertas';

export default function Login({ setAutenticado }) {
    const [form, setForm] = useState({ correoElectronico: '', password: '' });
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            await api.post('/Usuarios/login', form);
            setAutenticado(true);
            localStorage.setItem('token', 'activo');
            alertaExito('¡Bienvenido al sistema!');
            navigate('/usuarios');
        } catch (err) {
            alertaError('Correo o contraseña incorrectos. Verifica tus datos.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            background: '#f4f6f9' 
        }}>
            <form onSubmit={handleSubmit} style={{ 
                background: 'white', 
                padding: '40px 30px', 
                borderRadius: '12px', 
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', 
                width: '350px',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <h2 style={{ color: '#1e293b', margin: '0 0 8px 0', fontSize: '24px' }}>Iniciar Sesión</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Ingresa tus credenciales</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                        Correo electrónico
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
                        <input 
                            type="email" 
                            placeholder="tucorreo@correo.com"
                            value={form.correoElectronico} 
                            onChange={e => setForm({...form, correoElectronico: e.target.value})} 
                            required 
                            style={{ 
                                width: '100%', 
                                padding: '10px 10px 10px 40px', 
                                border: '1px solid #cbd5e1', 
                                borderRadius: '6px', 
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                        Contraseña
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={form.password} 
                            onChange={e => setForm({...form, password: e.target.value})} 
                            required 
                            style={{ 
                                width: '100%', 
                                padding: '10px 10px 10px 40px', 
                                border: '1px solid #cbd5e1', 
                                borderRadius: '6px', 
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={cargando}
                    className="btn-primary" 
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        fontSize: '15px',
                        opacity: cargando ? 0.7 : 1,
                        cursor: cargando ? 'not-allowed' : 'pointer'
                    }}
                >
                    {cargando ? 'Verificando...' : 'Entrar al Sistema'}
                </button>
            </form>
        </div>
    );
}