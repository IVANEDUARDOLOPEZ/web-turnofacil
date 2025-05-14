import React, { useState, useEffect } from 'react';
import { useUsuario } from '../context/UsuarioContext'; // Importa el contexto de usuario
import { db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
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


  // Función para cargar las reservas desde Firestore
  const cargarReservas = async () => {
    if (!usuario || !usuario.email) {
      console.log("No hay usuario logueado.");
      return;
    }

    console.log("Buscando reservas para:", usuario.email);

    try {
      const q = query(
        collection(db, "reservas"),
        where("usuario", "==", usuario.email),
        orderBy("fechaCreacion", "desc")
      );
      const querySnapshot = await getDocs(q);
      console.log("Reservas encontradas:", querySnapshot.docs.map(doc => doc.data()));

      const reservasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservas(reservasData);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
    }
  };

  // Usamos useEffect para cargar las reservas cuando se monta el componente o cuando el usuario cambie
  useEffect(() => {
    if (usuario && usuario.email) {
      console.log("Correo del usuario logueado:", usuario.email);
      cargarReservas();
    } else {
      console.log("Usuario no está logueado o email no disponible.");
    }
  }, [usuario]);

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

        
    </div>
  );
}

export default Reservar;
