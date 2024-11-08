import { useState } from "react";

const CreatePais = () => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el token JWT desde el almacenamiento local (o desde donde lo tengas guardado)
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      setError('No se ha encontrado un token válido');
      return;
    }

    // Crear el objeto de datos que se enviará al backend
    const paisData = {
      nombre: nombre,  // Solo el nombre del país
    };

    try {
      // Realizar la solicitud POST al backend para crear el país
      const response = await fetch('http://127.0.0.1:5000/paises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token en los encabezados
        },
        body: JSON.stringify(paisData),  // Enviar los datos del país como JSON
      });

      const data = await response.json();

      if (response.ok) {
        // Si la creación fue exitosa, mostrar mensaje
        setMessage(data.Mensaje || 'País creado correctamente');
        setNombre('');  // Limpiar el campo después de la creación
      } else {
        // Si hubo un error, mostrar mensaje de error
        setError(data.Mensaje || 'Error al crear el país');
      }
    } catch (err) {
      // Capturar errores de la solicitud
      setError('Error al conectar con el servidor');
      console.error('Error al crear el país', err);
    }
  };

  return (
    <div>
      <h2>Crear Nuevo País</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>País:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <button type="submit">Crear País</button>
      </form>
    </div>
  );
};

export default CreatePais;
