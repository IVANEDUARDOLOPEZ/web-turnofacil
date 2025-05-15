import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useUsuario } from '../context/UsuarioContext'; // Importa el hook aquí

function Login() {
  const { setUsuario } = useUsuario(); // Usa el hook para obtener setUsuario del contexto

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modoRegistro, setModoRegistro] = useState(true);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      let usuarioActual;
      if (modoRegistro) {
        usuarioActual = await createUserWithEmailAndPassword(auth, email, password);
        alert("Usuario registrado");
      } else {
        usuarioActual = await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso");
      }
      setUsuario(usuarioActual.user); // Actualizamos el estado de usuario aquí
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{modoRegistro ? "Registrarse" : "Iniciar Sesión"}</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          required
        /><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        /><br />
        <button type="submit">{modoRegistro ? "Registrar" : "Iniciar Sesión"}</button>
      </form>
      <button onClick={() => setModoRegistro(!modoRegistro)}>
        Cambiar a {modoRegistro ? "Iniciar Sesión" : "Registrarse"}
      </button>
    </div>
  );
}

export default Login;
