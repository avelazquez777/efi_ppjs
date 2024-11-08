import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const PaisView = () => {
  const [nombre, setPais] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Para navegar a la página de edición

  // Función para obtener la lista de Paises
  const fetchPaises = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/paises", {
        headers: { Authorization: `Bearer ${token}` },  // Asegúrate de enviar el token correctamente
      });

      if (!response.ok) {
        throw new Error("Error al obtener los Paises");
      }

      const data = await response.json();
      setPais(data);  // Aquí suponemos que la respuesta es una lista de Paises directamente
    } catch (error) {
      console.error(error);
      setMessage("Error al obtener los Paises.");
    }
  };

  // Eliminar Paise
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este Paise?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/Paises/${id}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el Pais");
        }

        setPais(Paises.filter((Pais) => Pais.id !== id));
        setMessage("Pais eliminado correctamente");
      } catch (error) {
        console.error(error);
        setMessage("Error al eliminar el Pais.");
      }
    }
  };

  // Redirigir a la página de edición del Paise
  const handleEdit = (id) => {
    navigate(`/Paises/edit/${id}`);
  };

  useEffect(() => {
    fetchPaises();  // Cargar la lista de Paises al cargar el componente
  }, []);

  return (
    <div className="container">
      {isAdmin ? (
        <div className="row">
          <div className="col-md-12">
            <h4>Listado de Paises</h4>
            <ul className="list-group">
              {Paises.length > 0 ? (
                Paises.map((Pais) => (
                  <li key={Pais.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{Pais.nombre}</span>
                    <div>
                      <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        className="p-button-warning p-button-sm me-2"
                        onClick={() => handleEdit(Pais.id)} // Acción de editar
                      />
                      <Button
                        label="Eliminar"
                        icon="pi pi-trash"
                        className="p-button-danger p-button-sm"
                        onClick={() => handleDelete(Pais.id)} // Acción de eliminar
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p>No hay Paises disponibles.</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p>No estás autorizado para gestionar Paises.</p>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default PaisView;


