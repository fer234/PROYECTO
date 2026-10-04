import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Inicio from './components/Inicio';
import Footer from './components/Footer';
import Usuarios from './components/Usuarios';
import Articulos from './components/Articulos';
import Produccion from './components/Produccion';

function App() {
  const [autenticado, setAutenticado] = useState(localStorage.getItem('token') === 'activo');

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setAutenticado(false);
  };

  return (
    <BrowserRouter>
      {/* Aqui manejo la posicion del navbar y el footer */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {autenticado && <Navbar onLogout={cerrarSesion} />}

        <div style={{ flex: 1 }}>
          <Routes>
            {!autenticado ? (
              <>
                <Route path="/login" element={<Login setAutenticado={setAutenticado} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/inicio" />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/articulos" element={<Articulos />} />
                <Route path="/produccion" element={<Produccion />} />
                <Route path="*" element={<Navigate to="/inicio" />} />
              </>
            )}
          </Routes>
        </div>

        {/* muestro el footer siempre */}
        {autenticado && <Footer />}

      </div>
    </BrowserRouter>
  );
}

export default App;