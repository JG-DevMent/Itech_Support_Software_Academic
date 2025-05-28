import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/usuarios/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        alert('No se pudo enviar el correo. Verifique el email.');
        setLoading(false);
        return;
      }
      alert('Correo de restablecimiento enviado.');
      navigate('/');
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="card-body-login">
        <div className="text-center">
          <div className="logo-container-login">
            <img src="/img/logo-itech-support.png" alt="ITECH SUPPORT" />
          </div>
          <h1 className="h1-login">Restablecer Contraseña</h1>
        </div>
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

export default ResetPassword; 