import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const UsersView = () => {
    const [users, setUsers] = useState([]); // Estado para la lista de usuarios
    const [selectedUser, setSelectedUser] = useState(null); // Para mantener el usuario que se va a eliminar
    const toast = useRef(null); // Ref para el Toast

    // Simulación de carga de usuarios (reemplaza con tu lógica real para obtener usuarios)
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        // Aquí llamas a tu API para obtener la lista de usuarios
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de pasar el token
            }
        });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios', life: 3000 });
        }
    };

    const handleDelete = (user) => {
        setSelectedUser(user); // Guarda el usuario seleccionado para eliminar
        confirmDialog({
            message: '¿Estás seguro de que deseas eliminar este usuario?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteUser(user.id), // Llama a la función deleteUser si el usuario acepta
            reject: () => {} // No hace nada si se cancela
        });
    };

    const deleteUser = async (userId) => {
        try {
            // Llamada a la API para eliminar el usuario
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de pasar el token
                },
            });

            if (response.ok) {
                // Aquí actualizas el estado de la lista de usuarios para reflejar la eliminación
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                // Mostrar mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
            } else {
                throw new Error('No se pudo eliminar el usuario');
            }
        } catch (error) {
            // Mostrar mensaje de error
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar el usuario', life: 3000 });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h3>Lista de Usuarios</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username}
                        <Button label="Eliminar" icon="pi pi-trash" onClick={() => handleDelete(user)} />
                    </li>
                ))}
            </ul>

            <ConfirmDialog />
        </div>
    );
};

export default UsersView;
