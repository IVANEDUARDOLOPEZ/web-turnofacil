import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig'; // Asegúrate de que Firebase esté configurado
import { onAuthStateChanged } from 'firebase/auth';

const UsuarioContext = createContext();

export const useUsuario = () => useContext(UsuarioContext);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};
