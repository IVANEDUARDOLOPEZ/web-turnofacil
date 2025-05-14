import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UsuarioProvider } from './context/UsuarioContext'; // <--- importante

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UsuarioProvider> {/* <--- Envuelve App aquí */}
      <App />
    </UsuarioProvider>
  </React.StrictMode>
);

reportWebVitals();
