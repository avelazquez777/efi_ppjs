import { useState } from "react";
import FabricanteView from "./FabricanteView";

const FabricantesContainer = () => {
  const [token] = useState(localStorage.getItem("token"));

  return token ? <FabricanteView token={token} /> : <p>No tienes acceso para gestionar fabricantes</p>;
};

export default FabricantesContainer;
