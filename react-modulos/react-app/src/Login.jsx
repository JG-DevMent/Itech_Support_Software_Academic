// Importamos React y useState para manejar el estado
import React, { useState } from 'react';
// Importamos useNavigate y Link para la navegación con React Router
import { useNavigate, Link } from 'react-router-dom';

// Creamos el componente funcional Login
function Login() {
  // Definimos los estados para el usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Hook para navegación programática
  const navigate = useNavigate();

  // Función que maneja el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realizamos la petición al backend para autenticar el usuario
      const response = await fetch('http://localhost:4000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        alert('Usuario o contraseña incorrectos. Intente nuevamente.');
        return;
      }
      // Si la autenticación es exitosa, guardamos el usuario en sessionStorage
      const user = await response.json();
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      alert('¡Bienvenido ' + user.username + '!');
      window.location.href = '/home.html';
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  // Renderizamos el formulario de login
  return (
    <div className="login-container">
      <div className="card-body-login">
        <div className="text-center">
          <div className="logo-container-login">
            <img src="/img/logo-itech-support.png" alt="ITECH SUPPORT" />
          </div>
          <h1 className="h1-login">¡Bienvenido a ITECH SUPPORT!</h1>
        </div>
        {/* Formulario de login */}
        <form className="user" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-user"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control form-control-user"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <Link to="/reset-password" className="a-login">
              ¿Olvidaste tu contraseña? Restablecer contraseña
            </Link>
          </div>
          <button type="submit" className="btn btn-primary btn-user btn-block">
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}

// Exportamos el componente Login para que pueda ser utilizado en otros archivos
export default Login; 