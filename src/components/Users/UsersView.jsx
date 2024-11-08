import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'; // Para los campos de texto
import { Checkbox } from 'primereact/checkbox'; // Para el checkbox de admin

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSeverity, setDialogSeverity] = useState(''); 
  const [editDialogVisible, setEditDialogVisible] = useState(false); // Popup para edición
  const [editUserData, setEditUserData] = useState(null); // Datos del usuario a editar
  const [editUsername, setEditUsername] = useState(''); // Nombre del usuario a editar
  const [editPassword, setEditPassword] = useState(''); // Contraseña del usuario
  const [editIsAdmin, setEditIsAdmin] = useState(false); // Estado de admin
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'admin'; 

  useEffect(() => {
    if (!token) {
      setDialogMessage('No estás autenticado');
      setDialogSeverity('error');
      setDialogVisible(true);
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
          setUsers(data);
          if (userRole === 'admin') {
            setIsAdmin(true);
          }
        } else {
          throw new Error('No se pudieron cargar los usuarios');
        }
      } catch (error) {
        setDialogMessage('Error al cargar los usuarios');
        setDialogSeverity('error');
        setDialogVisible(true);
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
          setUsers(users.filter(user => user.id !== userId));
          setDialogMessage('Usuario eliminado con éxito');
          setDialogSeverity('success');
        } else {
          setDialogMessage('Error al eliminar el usuario');
          setDialogSeverity('error');
        }
      } catch (error) {
        setDialogMessage('Error al eliminar el usuario');
        setDialogSeverity('error');
      } finally {
        setDialogVisible(true);
      }
    }
  };

  const openEditDialog = (user) => {
    setEditUserData(user);
    setEditUsername(user.username);
    setEditIsAdmin(user.is_admin);
    setEditDialogVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${editUserData.id}/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: editUsername,
          password: editPassword, 
          is_admin: editIsAdmin,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Actualizar el estado local con el usuario editado
        setUsers(users.map(user => user.id === updatedUser.Usuario.id ? updatedUser.Usuario : user));
        
        setDialogMessage('Usuario editado con éxito');
        setDialogSeverity('success');
        setEditDialogVisible(false);
      } else {
        const errorData = await response.json();
        setDialogMessage(`Error al editar el usuario: ${errorData.Mensaje}`);
        setDialogSeverity('error');
      }
    } catch (error) {
      setDialogMessage('Error en la edición del usuario');
      setDialogSeverity('error');
    } finally {
      setDialogVisible(true);
    }
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setDialogMessage('');
  };

  const hideEditDialog = () => {
    setEditDialogVisible(false);
    setEditUserData(null);
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Contraseña</th>
            <th>Es admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{'********'}</td>
                <td>{user.is_admin ? "Sí" : "No"}</td>
                <td>
                  {isAdmin && (
                    <>
                      <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        className="p-button-warning p-button-sm me-2"
                        onClick={() => openEditDialog(user)}
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
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay usuarios disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Diálogo para mostrar mensajes */}
      <Dialog
        header={dialogSeverity === 'error' ? 'Error' : 'Confirmación'}
        visible={dialogVisible}
        style={{ width: '350px' }}
        onHide={hideDialog}
        footer={<Button label="OK" icon="pi pi-check" onClick={hideDialog} />}
      >
        <p>{dialogMessage}</p>
      </Dialog>

      {/* Diálogo para editar usuarios */}
      <Dialog
        header="Editar Usuario"
        visible={editDialogVisible}
        style={{ width: '450px' }}
        onHide={hideEditDialog}
        footer={
          <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideEditDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={handleEditSubmit} />
          </>
        }
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="username">Nombre de Usuario</label>
            <InputText
              id="username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
          </div>
          <div className="p-field">
            <label htmlFor="password">Nueva Contraseña (opcional)</label>
            <InputText
              id="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              type="password"
            />
          </div>
          <div className="p-field-checkbox">
            <Checkbox
              inputId="isAdmin"
              checked={editIsAdmin}
              onChange={(e) => setEditIsAdmin(e.checked)}
            />
            <label htmlFor="isAdmin">Es Administrador</label>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserView;
