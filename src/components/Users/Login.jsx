import { useState } from "react";

const VerificarLogin = () => {
  const [message, setMessage] = useState("");

  const login = async (usuario, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${usuario}:${password}`),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.Token;
        localStorage.setItem("token", accessToken);

        const claims = JSON.parse(atob(accessToken.split(".")[1]));
        localStorage.setItem("isAdmin", claims.administrador);
        setMessage("Inicio de sesión exitoso.");
      } else {
        setMessage("Error en el inicio de sesión. Verifique sus credenciales.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setMessage("Ocurrió un error durante el inicio de sesión.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { usuario, password } = e.target.elements;
    login(usuario.value, password.value);
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <h4>Inicio de Sesión</h4>
        <div className="mb-3">
          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            required
            style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} // Aplicando estilos en línea
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }} // Aplicando estilos en línea
          />
        </div>
        <button type="submit" className="p-button font-bold">Iniciar Sesión</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default VerificarLogin;
