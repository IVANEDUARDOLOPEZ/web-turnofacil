import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUsuario } from '../context/UsuarioContext';

function PanelUsuario() {
  const { usuario } = useUsuario(); // Obtenemos el usuario desde el contexto
  const [reservas, setReservas] = useState([]);

  // Cargar las reservas del usuario
  useEffect(() => {
    if (usuario) {
      const obtenerReservas = async () => {
        const q = query(
          collection(db, "reservas"),
          where("usuario", "==", usuario.email)
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
              {/* Aquí puedes agregar un botón de cancelar si lo necesitas */}
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
