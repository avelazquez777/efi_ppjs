import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import CreateFabricante from "./CreateFabricante";

const FabricanteView = ({ token }) => {
  const [fabricantes, setFabricantes] = useState([]);
  const [editingFabricante, setEditingFabricante] = useState(null);
  const [message, setMessage] = useState("");

  const fetchFabricantes = async () => {
    const response = await fetch("http://127.0.0.1:5000/fabricantes", {
      headers: { Authorization: token },
    });
    const data = await response.json();
    setFabricantes(data);
  };

  useEffect(() => {
    fetchFabricantes();
  }, [token]);

  const handleSave = async (values) => {
    const method = editingFabricante ? "PUT" : "POST";
    const url = editingFabricante
      ? `http://127.0.0.1:5000/fabricantes/${editingFabricante.id}/editar`
      : "http://127.0.0.1:5000/fabricantes";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          nombre: values.nombre,
          pais_id: values.pais_id,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar el fabricante");

      setEditingFabricante(null);
      fetchFabricantes();
      setMessage(editingFabricante ? "Fabricante actualizado" : "Fabricante creado");
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar el fabricante");
    }
  };

  const handleEdit = (fabricante) => {
    setEditingFabricante(fabricante);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/fabricantes/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!response.ok) throw new Error("Error al eliminar el fabricante");

      fetchFabricantes();
      setMessage("Fabricante eliminado");
    } catch (error) {
      console.error(error);
      setMessage("Error al eliminar el fabricante");
    }
  };

  return (
    <div>
      <h4>Fabricantes</h4>
      <div className="row">
        <div className="col-md-6">
          <CreateFabricante onSave={handleSave} fabricanteToEdit={editingFabricante} />
        </div>
        <div className="col-md-6">
          <h5>Listado de Fabricantes</h5>
          <ul className="list-group">
            {fabricantes.map((fabricante) => (
              <li
                key={fabricante.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{fabricante.nombre}</span>
                <div>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    className="p-button-warning p-button-sm me-2"
                    onClick={() => handleEdit(fabricante)}
                  />
                  <Button
                    label="Eliminar"
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    onClick={() => handleDelete(fabricante.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default FabricanteView;
