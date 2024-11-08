import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button'; // Asumo que usas PrimeReact para los botones

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para saber si es admin
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Suposición de que almacenas el rol de usuario

  useEffect(() => {
    if (!token) {
      // Si no hay token, redirigir a login o mostrar mensaje de error
      alert('No estás autenticado');
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data); // Suponemos que la respuesta contiene los usuarios
          if (userRole === 'admin') {
            setIsAdmin(true); // Si es admin, habilitar las opciones
          }
        } else {
          throw new Error('No se pudieron cargar los usuarios');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token, userRole, navigate]);

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/users/${userId}/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          // Eliminar el usuario de la lista localmente
          setUsers(users.filter(user => user.id !== userId));
        } else {
          alert('Error al eliminar el usuario');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (userId) => {
    // Redirigir a la página de edición de usuario
    navigate(`/users/edit/${userId}`);
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {isAdmin && (
                  <>
                    <Button
                      label="Editar"
                      icon="pi pi-pencil"
                      className="p-button-warning p-button-sm me-2"
                      onClick={() => handleEdit(user.id)}
                    />
                    <Button
                      label="Eliminar"
                      icon="pi pi-trash"
                      className="p-button-danger p-button-sm"
                      onClick={() => handleDelete(user.id)}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserView;


