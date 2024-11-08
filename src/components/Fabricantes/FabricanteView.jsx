import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Fabricantes = () => {
  const [fabricantes, setFabricantes] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const navigate = useNavigate(); // Para navegar a la página de edición

  // Función para obtener la lista de fabricantes
  const fetchFabricantes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/fabricantes", {
        headers: { Authorization: `Bearer ${token}` },  // Asegúrate de enviar el token correctamente
      });

      if (!response.ok) {
        throw new Error("Error al obtener los fabricantes");
      }

      const data = await response.json();
      setFabricantes(data);  // Aquí suponemos que la respuesta es una lista de fabricantes directamente
    } catch (error) {
      console.error(error);
      setMessage("Error al obtener los fabricantes.");
    }
  };

  // Eliminar fabricante
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este fabricante?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/fabricantes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el fabricante");
        }

        setFabricantes(fabricantes.filter((fabricante) => fabricante.id !== id));
        setMessage("Fabricante eliminado correctamente");
      } catch (error) {
        console.error(error);
        setMessage("Error al eliminar el fabricante.");
      }
    }
  };

  // Redirigir a la página de edición del fabricante
  const handleEdit = (id) => {
    navigate(`/fabricantes/edit/${id}`);
  };

  useEffect(() => {
    fetchFabricantes();  // Cargar la lista de fabricantes al cargar el componente
  }, []);

  return (
    <div className="container">
      {isAdmin ? (
        <div className="row">
          <div className="col-md-12">
            <h4>Listado de Fabricantes</h4>
            <ul className="list-group">
              {fabricantes.length > 0 ? (
                fabricantes.map((fabricante) => (
                  <li key={fabricante.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{fabricante.nombre}</span>
                    <div>
                      <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        className="p-button-warning p-button-sm me-2"
                        onClick={() => handleEdit(fabricante.id)} // Acción de editar
                      />
                      <Button
                        label="Eliminar"
                        icon="pi pi-trash"
                        className="p-button-danger p-button-sm"
                        onClick={() => handleDelete(fabricante.id)} // Acción de eliminar
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p>No hay fabricantes disponibles.</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>No estás autorizado para gestionar fabricantes.</p>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Fabricantes;


