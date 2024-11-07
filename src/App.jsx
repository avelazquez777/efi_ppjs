import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import Home from "./components/Home";
import UsersContainer from "./components/Users/UsersContainer";
import CreateUser from "./components/Users/CreateUser";
import FabricanteView from "./components/Fabricante/FabricanteView"; // Vista de fabricantes
import CreateFabricante from "./components/Fabricante/CreateFabricante"; // Crear fabricante
import verificarLogin from "./components/Users/Login"; 
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
        <Route path="/usuarios" element={<UsersContainer />} />
        <Route path="/nuevo-usuario" element={<CreateUser />} />
        <Route path="/fabricantes" element={<FabricanteView />} /> {/* Vista de fabricantes */}
        <Route path="/nuevo-fabricante" element={<CreateFabricante />} /> {/* Crear nuevo fabricante */}
        <Route path="/login" element={<verificarLogin />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

