// src/pages/PanelAdmin.js

import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig'; // Asegúrate de importar Firestore
import { collection, getDocs } from 'firebase/firestore';

const PanelAdmin = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const obtenerReservas = async () => {
      const querySnapshot = await getDocs(collection(db, 'reservas'));
      const listaReservas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservas(listaReservas);
    };

    obtenerReservas();
  }, []);

  const cancelarReserva = async (id) => {
    // Lógica para cancelar la reserva en la base de datos
    console.log("Reserva cancelada:", id);
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <div>
        <h3>Reservas realizadas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.usuario}</td>
                <td>{reserva.servicio}</td>
                <td>{reserva.fecha}</td>
                <td>
                  <button onClick={() => cancelarReserva(reserva.id)}>Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelAdmin;
