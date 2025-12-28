/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

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

  //Definimos la URL base de la API desde una variable global
  const API_BASE_URL = window.API_BASE_URL || "http://192.168.1.7:4000";


  // Función que maneja el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realizamos la petición al backend para autenticar el usuario
      const response = await fetch(`${window.API_BASE_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (window.notificaciones) {
          window.notificaciones.error(errorData.error || 'Usuario o contraseña incorrectos. Por favor, verifique sus credenciales e intente nuevamente.');
        } else {
          alert(errorData.error || 'Usuario o contraseña incorrectos. Intente nuevamente.');
        }
        return;
      }
      
      // Si la autenticación es exitosa, guardamos el usuario y token en sessionStorage
      const userData = await response.json();
      
      // Guardar token JWT
      sessionStorage.setItem('jwtToken', userData.token);
      
      // Guardar datos del usuario (sin el token)
      const { token, ...userInfo } = userData;
      sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
      
      // Mostrar notificación de bienvenida especial
      if (window.notificaciones) {
        window.notificaciones.bienvenida(`¡Hola ${userInfo.username}! Has iniciado sesión correctamente.`);
        setTimeout(() => {
          window.location.href = '/home.html';
        }, 2000);
      } else {
        alert('¡Bienvenido ' + userInfo.username + '!');
        window.location.href = '/home.html';
      }
    } catch (error) {
      if (window.notificaciones) {
        window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión a internet e intente nuevamente.');
      } else {
        alert('Error de conexión con el servidor.');
      }
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