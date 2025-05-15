import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useUsuario } from '../context/UsuarioContext';

function PanelUsuario() {
  const { usuario } = useUsuario();
  const [reservas, setReservas] = useState([]);

  const cancelarReserva = async (id) => {
    try {
      await deleteDoc(doc(db, "reservas", id));
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  useEffect(() => {
    if (!usuario?.email) return;

    const q = query(
      collection(db, "reservas"),
      where("usuario", "==", usuario.email)
    );
    
    // Escucha cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reservasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservas(reservasData);
    });

    // Limpieza al desmontar el componente
    return () => unsubscribe();
  }, [usuario]);

  return (
    <div>
      <h2>Mis Reservas</h2>
      {reservas.length > 0 ? (
        <ul>
          {reservas.map(reserva => (
            <li key={reserva.id}>
              <strong>Servicio:</strong> {reserva.servicio} <br />
              <strong>Fecha:</strong> {reserva.fecha} <br />
              <strong>Hora:</strong> {reserva.hora} <br />
              <button onClick={() => cancelarReserva(reserva.id)}>Cancelar Reserva</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes reservas.</p>
      )}
    </div>
  );
}

export default PanelUsuario;