import React from 'react';
import { useUsuario } from './context/UsuarioContext';
import Login from './pages/Login';
import Reservar from './pages/Reservar';
import PanelUsuario from './pages/PanelUsuario';
import PanelAdmin from './pages/PanelAdmin';

function App() {
  const { usuario } = useUsuario();

  return (
    <div>
      {!usuario ? (
        <Login />
      ) : (
        <>
          <Reservar />
          <PanelUsuario />
          {usuario.email === 'admin@turnofacil.com' && <PanelAdmin />}
        </>
      )}
    </div>
  );
}

export default App;
