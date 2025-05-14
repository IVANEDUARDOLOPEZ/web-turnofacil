import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/UsuarioContext'; // Importa el contexto de usuario
import { db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
import './Reservar.css';

function Reservar() {
  const { usuario } = useUsuario(); // Aquí obtenemos el usuario
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [reservas, setReservas] = useState([]); // Estado para manejar las reservas

  // Función para manejar la reserva
  const manejarReserva = async (e) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    try {
      await addDoc(collection(db, "reservas"), {
        servicio: servicio,
        fecha: fecha,
        hora: hora,
        usuario: usuario.email,
        fechaCreacion: new Date(),
      });
      alert("Reserva realizada con éxito");
      cargarReservas(); // Cargar las reservas después de hacer una nueva
    } catch (error) {
      alert("Error al realizar la reserva: " + error.message);
    }
  };

  // Función para cancelar una reserva
  const cancelarReserva = async (id) => {
    try {
      await deleteDoc(doc(db, 'reservas', id));
      console.log("Reserva eliminada correctamente.");
      cargarReservas(); // Volver a cargar las reservas después de eliminar
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  // Función para cargar las reservas desde Firestore
  const cargarReservas = async () => {
    try {
      const q = query(collection(db, "reservas"), orderBy("fechaCreacion", "desc"));
      const querySnapshot = await getDocs(q);
      const reservasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReservas(reservasData); // Actualizar el estado con las reservas
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
    }
  };

  // Usamos useEffect para cargar las reservas cuando se monta el componente
  useEffect(() => {
    cargarReservas();
  }, []);

return (
  <div className="reservar-container">
    <h2>Reservar turno</h2>
    <form onSubmit={manejarReserva}>
      <label>Servicio:</label>
      <select value={servicio} onChange={(e) => setServicio(e.target.value)} required>
        <option value="">Selecciona un servicio</option>
        <option value="Peluquería">Peluquería</option>
        <option value="Gimnasio">Gimnasio</option>
        <option value="Médico">Médico</option>
      </select>

      <label>Fecha:</label>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

      <label>Hora:</label>
      <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />

      <button type="submit">Reservar</button>
    </form>

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
  </div>
);

}

export default Reservar;
