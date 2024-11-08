import { Fragment } from "react";
import { Link } from "react-router-dom"; // Para enlazar a otras páginas

const Home = () => {
    return (
        <Fragment>
            <h1>Bienvenido al Sistema de Gestión</h1>
            <h3>Gestiona tus usuarios y fabricantes fácilmente</h3>
            <p>Este sistema te permite agregar, ver y administrar usuarios y fabricantes en tu plataforma.</p>

            <div>
                <h4>Comienza por:</h4>
                <ul>
                    <li><Link to="/usuarios">Gestionar Usuarios</Link></li>
                    <li><Link to="/Pais">Ver Paises</Link></li>
                    <li><Link to="/nuevo-pais">Crear Nuevo Pais</Link></li>
                </ul>
            </div>
        </Fragment>
    );
}

export default Home;
