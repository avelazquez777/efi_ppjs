import { Formik } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

const CreateFabricante = ({ onSave, fabricanteToEdit }) => {
  const [initialValues, setInitialValues] = useState({ nombre: "", pais_id: "" });

  const ValidationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("Este campo es requerido")
      .min(3, "Debe tener mínimo 3 caracteres")
      .max(50, "No debe ser mayor a 50 caracteres"),
    pais_id: Yup.number()
      .required("Este campo es requerido")
      .positive("Debe ser un número válido")
      .integer("Debe ser un número entero"),
  });

  useEffect(() => {
    if (fabricanteToEdit) {
      setInitialValues({
        nombre: fabricanteToEdit.nombre,
        pais_id: fabricanteToEdit.pais_id,
      });
    }
  }, [fabricanteToEdit]);

  const handleSubmit = async (values) => {
    onSave(values);
  };

  return (
    <div>
      <h4>{fabricanteToEdit ? "Editar Fabricante" : "Crear Nuevo Fabricante"}</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="nombre"
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nombre}
                placeholder="Nombre del fabricante"
              />
              {errors.nombre && touched.nombre && (
                <div className="text-danger">{errors.nombre}</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="pais_id"
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pais_id}
                placeholder="ID del país"
              />
              {errors.pais_id && touched.pais_id && (
                <div className="text-danger">{errors.pais_id}</div>
              )}
            </div>
            <Button
              label={fabricanteToEdit ? "Actualizar" : "Guardar"}
              icon="pi pi-check"
              className="p-button-success"
              disabled={!isValid}
              type="submit"
            />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CreateFabricante;
