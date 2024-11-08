import { useState } from "react";
import PaisView from "./PaisView";

const PaisesContainer = () => {
  const [token] = useState(localStorage.getItem("token"));

  return token ? <PaisView token={token} /> : <p>No tienes acceso para gestionar Paises</p>;
};

export default PaisesContainer;
