import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import Home from "./components/Home";
import CreateUser from "./components/Users/CreateUser";
import VerificarLogin from "./components/Users/Login";
import PaisView from "./components/Paises/PaisView"; // Vista de Paiss
import CreatePais from "./components/Paises/CreatePais"; // Crear Pais
import "./App.css";

function App() {
  const items = [
    { label: "Inicio", icon: "pi pi-home", url: "/" },
    { label: "Usuarios", icon: "pi pi-users", url: "/usuarios" },
    { label: "Nuevo usuario", icon: "pi pi-user-plus", url: "/nuevo-usuario" },
    { label: "Paiss", icon: "pi pi-briefcase", url: "/Paises" }, // Ruta para ver Paiss
    { label: "Nuevo Pais", icon: "pi pi-plus-circle", url: "/nuevo-Pais" }, // Ruta para crear Pais
    { label: "Login", icon: "pi pi-sign-in", url: "/login" }, 
  ];

  return (
    <BrowserRouter>
      <Menubar model={items} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuevo-usuario" element={<CreateUser />} />
        <Route path="/Paises" element={<PaisView />} /> {/* Vista de Paiss */}
        <Route path="/nuevo-pais" element={<CreatePais />} /> {/* Crear nuevo fabricante */}
        <Route path="/login" element={<VerificarLogin />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

