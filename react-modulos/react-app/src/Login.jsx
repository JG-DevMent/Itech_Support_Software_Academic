import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        alert('Usuario o contraseña incorrectos. Intente nuevamente.');
        return;
      }
      const user = await response.json();
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      alert('¡Bienvenido ' + user.username + '!');
      window.location.href = '/home.html';
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="card-body-login">
        <div className="text-center">
          <div className="logo-container-login">
            <img src="/img/logo-itech-support.png" alt="ITECH SUPPORT" />
          </div>
          <h1 className="h1-login">¡Bienvenido a ITECH SUPPORT!</h1>
        </div>
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

export default Login; 