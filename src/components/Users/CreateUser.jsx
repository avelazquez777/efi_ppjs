import { useState, useEffect, useRef } from "react";
import UsersView from "./UsersView";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Tema de PrimeReact
import "primereact/resources/primereact.min.css"; // Estilos de PrimeReact
import "primeicons/primeicons.css"; // Íconos de PrimeReact

const CreateUser = () => {

  const [username, setUsername] = useState('');  // Cambié 'usuario' a 'username'
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el token JWT desde el almacenamiento local (o desde donde lo tengas guardado)
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      setError('No se ha encontrado un token válido');
      return;
    }

    // Crear el objeto de datos que se enviará al backend
    const userData = {
      username: username,  // Cambié 'usuario' por 'username'
      password,
      is_admin: isAdmin,
    };

    try {
      // Realizar la solicitud POST al backend para crear el usuario
      const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token en los encabezados
        },
        body: JSON.stringify(userData),  // Enviar los datos como JSON
      });

      const data = await response.json();

      if (response.ok) {
        // Si la creación fue exitosa, mostrar mensaje
        setMessage(data.Mensaje || 'Usuario creado correctamente');
        setUsername('');
        setPassword('');
        setIsAdmin(false);
      } else {
        // Si hubo un error, mostrar mensaje de error
        setError(data.Mensaje || 'Error al crear el usuario');
      }
    } catch (err) {
      // Capturar errores de la solicitud
      setError('Error al conectar con el servidor');
      console.error('Error al crear el usuario:', err);
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Usuario</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}  // Cambié 'usuario' por 'username'
            onChange={(e) => setUsername(e.target.value)}  // Cambié 'setUsuario' por 'setUsername'
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Es administrador:</label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </div>

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default CreateUser;
