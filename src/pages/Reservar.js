import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig"; // Asegúrate de tener acceso a la configuración de Firebase
import { collection, getDocs, query, where } from "firebase/firestore";

const Reservar = () => {
  const [reservas, setReservas] = useState([]);
  
  useEffect(() => {
    // Obtener el ID del usuario logueado
    const userId = auth.currentUser?.uid;

    // Si el usuario está logueado, obtener sus reservas
    if (userId) {
      const reservasRef = collection(db, "reservas");
      const q = query(reservasRef, where("userId", "==", userId)); // Filtrar por userId

      const obtenerReservas = async () => {
        const querySnapshot = await getDocs(q);
        const reservasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservas(reservasData);
      };

      obtenerReservas();
    }
  }, []); // Se ejecuta una sola vez al montar el componente

  return (
    <div className="reservas-section">
      <h3>Mis reservas:</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {reservas.length > 0 ? (
          reservas.map((reserva) => (
            <li key={reserva.id} className="reserva-card">
              <p><strong>Servicio:</strong> {reserva.servicio}</p>
              <p><strong>Fecha:</strong> {reserva.fecha}</p>
              <p><strong>Hora:</strong> {reserva.hora}</p>
              <button onClick={() => cancelarReserva(reserva.id)}>Cancelar Reserva</button>
            </li>
          ))
        ) : (
          <p>No tienes reservas.</p>
        )}
      </ul>
    </div>
  );
};

export default Reservar;
