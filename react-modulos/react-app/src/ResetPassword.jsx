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

// Creamos el componente funcional ResetPassword
function ResetPassword() {
  // Definimos los estados para el email y el estado de carga
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // Hook para navegación programática
  const navigate = useNavigate();

  // Función que maneja el envío del formulario de restablecimiento de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Realizamos la petición al backend para enviar el correo de restablecimiento de contraseña
      const response = await fetch(`${window.API_BASE_URL}/api/usuarios/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        // Si la respuesta no es exitosa, mostramos un mensaje de error
        if (window.notificaciones) {
          window.notificaciones.error('No se pudo enviar el correo. Por favor, verifique el email e intente nuevamente.');
        } else {
          alert('No se pudo enviar el correo. Verifique el email.');
        }
        setLoading(false);
        return;
      }
      // Si la respuesta es exitosa, mostramos un mensaje de éxito
      if (window.notificaciones) {
        window.notificaciones.exito('Correo de restablecimiento enviado. Por favor, revise su bandeja de entrada.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        alert('Correo de restablecimiento enviado.');
        navigate('/');
      }
    } catch (error) {
      if (window.notificaciones) {
        window.notificaciones.error('Error de conexión con el servidor. Por favor, verifique su conexión a internet e intente nuevamente.');
      } else {
        alert('Error de conexión con el servidor.');
      }
    }
    setLoading(false);
  };

  // Renderizamos el formulario de restablecimiento de contraseña
  return (
    <div className="login-container">
      <div className="card-body-login">
        <div className="text-center">
          <div className="logo-container-login">
            <img src="/img/logo-itech-support.png" alt="ITECH SUPPORT" />
          </div>
          <h1 className="h1-login">Restablecer Contraseña</h1>
        </div>
        {/* Formulario de restablecimiento de contraseña */}
        <form className="user" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control form-control-user"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-user btn-block" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
        <hr />
        <div className="text-center">
          <Link className="a-login" to="/">Volver al Login</Link>
        </div>
      </div>
    </div>
  );
}

// Exportamos el componente ResetPassword para que pueda ser utilizado en otros archivos
export default ResetPassword; 