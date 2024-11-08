import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

const PaisView = () => {
  const [paises, setPaises] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPais, setSelectedPais] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedNombre, setEditedNombre] = useState("");
  const token = localStorage.getItem("token");
  const userRole = "admin"; // Cambia el rol según sea necesario

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage("No estás autenticado.");
      navigate("/login");
      return;
    }

    if (userRole === "admin") {
      setIsAdmin(true);
      fetchPaises();
    } else {
      fetchPaises(); // Cargar países también si no es admin
      setIsAdmin(false);
    }
  }, [token, userRole, navigate]);

  const fetchPaises = async () => {
    try {
      const responsePaises = await fetch("http://127.0.0.1:5000/paises", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!responsePaises.ok) {
        throw new Error("Error al obtener los Países");
      }

      const paisData = await responsePaises.json();
      setPaises(paisData);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setMessage("Error al obtener los datos.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este País?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/paises/${id}/delete`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al eliminar el País");
        }

        setPaises(paises.filter((pais) => pais.id !== id));
        setMessage("País eliminado correctamente");
      } catch (error) {
        console.error(error);
        setMessage("Error al eliminar el País.");
      }
    }
  };

  const handleEdit = (pais) => {
    setSelectedPais(pais);
    setEditedNombre(pais.nombre);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/paises/${selectedPais.id}/edit`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: editedNombre }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el País");
      }

      const updatedPaises = paises.map((pais) =>
        pais.id === selectedPais.id ? { ...pais, nombre: editedNombre } : pais
      );
      setPaises(updatedPaises);

      setEditModalVisible(false);
      setMessage("País actualizado correctamente");
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar el País.");
    }
  };

  return (
    <div className="container d-flex justify-content-center"> {/* Centrar la tabla */}
      <div className="row">
        <div className="col-md-10"> {/* Hacer que la tabla tenga un ancho adecuado */}
          {isAdmin || paises.length > 0 ? (
            <div>
              <h4 className="text-center">Listado de Países</h4> {/* Título centrado */}
              <table className="table table-striped table-bordered text-center"> {/* Tabla centrada */}
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del País</th>
                    {isAdmin && <th>Acciones</th>} {/* Mostrar acciones solo para admin */}
                  </tr>
                </thead>
                <tbody>
                  {paises.map((pais) => (
                    <tr key={pais.id}>
                      <td>{pais.id}</td>
                      <td>{pais.nombre}</td>
                      {isAdmin && (
                        <td>
                          <div className="d-flex justify-content-center">
                            {/* Botones solo si es admin */}
                            <Button
                              label="Editar"
                              icon="pi pi-pencil"
                              className="p-button-rounded p-button-warning p-button-sm me-2"
                              onClick={() => handleEdit(pais)}
                            />
                            <Button
                              label="Eliminar"
                              icon="pi pi-trash"
                              className="p-button-rounded p-button-danger p-button-sm"
                              onClick={() => handleDelete(pais.id)}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No hay Países disponibles.</p>
          )}
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </div>

      <Dialog
        visible={editModalVisible}
        style={{ width: "450px" }}
        header="Editar País"
        modal
        onHide={() => setEditModalVisible(false)}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setEditModalVisible(false)}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              className="p-button-text"
              onClick={handleSaveEdit}
            />
          </div>
        }
      >
        <div className="p-field">
          <label htmlFor="nombre">Nombre del País</label>
          <InputText
            id="nombre"
            value={editedNombre}
            onChange={(e) => setEditedNombre(e.target.value)}
            autoFocus
          />
        </div>
      </Dialog>
    </div>
  );
};

export default PaisView;
