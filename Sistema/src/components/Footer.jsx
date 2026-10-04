import { Globe, Mail, Phone, MapPin, Droplet } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            background: '#1e293b',
            color: '#94a3b8',
            padding: '35px 40px 20px',
            marginTop: 'auto',
            borderTop: '1px solid #334155',
            fontSize: '14px'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '35px',
                maxWidth: '1200px',
                margin: '0 auto 25px',
                textAlign: 'left'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Droplet size={20} color="#38bdf8" />
                        <h3 style={{ color: '#ffffff', fontSize: '16px', margin: 0, letterSpacing: '0.5px' }}>
                            PEÑA DE HOREB
                        </h3>
                    </div>
                    <p style={{ lineHeight: '1.6', margin: '0 0 10px', color: '#cbd5e1', fontSize: '13px' }}>
                        <strong>Razón Social:</strong> Industrias Z.P, S.A de C.V.
                    </p>
                    <p style={{ lineHeight: '1.5', margin: '0', color: '#94a3b8', fontSize: '13px' }}>
                        Tratamiento, envasado y distribución de agua purificada bajo estrictos estándares de calidad e inocuidad.
                    </p>
                </div>
                <div>
                    <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '12px' }}>Contacto & Ubicación</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <MapPin size={16} color="#38bdf8" />
                        <span>El Salvador</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Phone size={16} color="#38bdf8" />
                        <span>+503 2200-0000</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="#38bdf8" />
                        <span>contacto@penadehoreb.sv</span>
                    </div>
                </div>
                <div>
                    <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '12px' }}>Síguenos</h4>
                    <p style={{ margin: '0 0 12px', fontSize: '13px' }}>Conéctate con nosotros en nuestras redes sociales oficiales.</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <a 
                            href="https://www.facebook.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={socialBtnStyle}
                        >
                            Facebook
                        </a>
                        <a 
                            href="https://www.instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={socialBtnStyle}
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
            <div style={{
                borderTop: '1px solid #334155',
                paddingTop: '15px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#64748b'
            }}>
                © {new Date().getFullYear()} Envasadora de agua PEÑA DE HOREB (Industrias Z.P, S.A de C.V.). Todos los derechos reservados.
            </div>
        </footer>
    );
}

const socialBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '6px',
    background: '#334155',
    color: '#f8fafc',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background 0.2s',
};