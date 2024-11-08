import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import Home from "./components/Home";
import CreateUser from "./components/Users/CreateUser";
import VerificarLogin from "./components/Users/Login";
import FabricanteView from "./components/Fabricantes/FabricanteView"; // Vista de fabricantes
import CreateFabricante from "./components/Fabricantes/CreateFabricante"; // Crear fabricante
import "./App.css";

function App() {
  const items = [
    { label: "Inicio", icon: "pi pi-home", url: "/" },
    { label: "Usuarios", icon: "pi pi-users", url: "/usuarios" },
    { label: "Nuevo usuario", icon: "pi pi-user-plus", url: "/nuevo-usuario" },
    { label: "Fabricantes", icon: "pi pi-briefcase", url: "/fabricantes" }, // Ruta para ver fabricantes
    { label: "Nuevo fabricante", icon: "pi pi-plus-circle", url: "/nuevo-fabricante" }, // Ruta para crear fabricante
    { label: "Login", icon: "pi pi-sign-in", url: "/login" }, 
  ];

  return (
    <BrowserRouter>
      <Menubar model={items} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuevo-usuario" element={<CreateUser />} />
        <Route path="/fabricantes" element={<FabricanteView />} /> {/* Vista de fabricantes */}
        <Route path="/nuevo-fabricante" element={<CreateFabricante />} /> {/* Crear nuevo fabricante */}
        <Route path="/login" element={<VerificarLogin />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

