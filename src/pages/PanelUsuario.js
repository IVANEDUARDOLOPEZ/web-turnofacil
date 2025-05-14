import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
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

  // Cancelar una reserva
  const cancelarReserva = async (id) => {
    try {
      await deleteDoc(doc(db, "reservas", id));
      alert("Reserva cancelada con éxito.");
      setReservas(reservas.filter(reserva => reserva.id !== id)); // Elimina la reserva de la lista local
    } catch (error) {
      alert("Error al cancelar la reserva: " + error.message);
    }
  };


}

export default PanelUsuario;
