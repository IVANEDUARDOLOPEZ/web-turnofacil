import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useUsuario } from '../context/UsuarioContext';

function PanelUsuario() {
  const { usuario } = useUsuario(); // Obtenemos el usuario desde el contexto
  const [reservas, setReservas] = useState([]);

  // Función para cancelar una reserva
  const cancelarReserva = async (id) => {
    try {
      // Elimina la reserva de Firestore
      await deleteDoc(doc(db, "reservas", id));
      console.log("Reserva eliminada correctamente.");
      // Actualiza el estado después de la eliminación
      setReservas(reservas.filter(reserva => reserva.id !== id));
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  // Cargar las reservas del usuario
  useEffect(() => {
    if (usuario) {
      console.log("Correo del usuario logueado: ", usuario.email); // Verifica el correo
      const obtenerReservas = async () => {
        const q = query(
          collection(db, "reservas"),
          where("usuario", "==", usuario.email) // Filtramos por el correo del usuario
        );
        const querySnapshot = await getDocs(q);
        const reservasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservas(reservasData);
      };

      obtenerReservas();
    }
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
