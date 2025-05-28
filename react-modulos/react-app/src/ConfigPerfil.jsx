import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ConfigPerfil() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    if (mostrarLista) {
      fetchUsuarios();
    }
  }, [mostrarLista]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      alert('Error al cargar usuarios');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        alert('Error al crear usuario');
        return;
      }
      alert('Usuario creado correctamente');
      setForm({ username: '', email: '', password: '', phone: '', role: '' });
      if (mostrarLista) fetchUsuarios();
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="card-box">
      <div className="card-body">
        <h1 className="text-h1">Configuración Usuarios</h1>
        <div className="mb-4">
          <Link to="/configuracion" className="btnreverse-confi">
            <i className="fas fa-arrow-left"></i> Volver a Configuración
          </Link>
        </div>
        <div className="mb-4 button-group">
          <button onClick={() => setMostrarLista(true)} className="btn-primary">
            <i className="fas fa-list"></i> Ver Lista de Usuarios
          </button>
          <button onClick={() => setMostrarLista(false)} className="btn-primary">
            <i className="fas fa-user-plus"></i> Crear Nuevo Usuario
          </button>
        </div>
        {mostrarLista ? (
          <div id="userListContainer">
            <h2 className="text-h2 mb-3">Lista de Usuarios</h2>
            <div className="table-responsive">
              <table className="table table-bordered" id="userTable">
                <thead className="table-color">
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody id="userTableBody">
                  {usuarios.map((u) => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <form id="profileForm" className="formbox" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario <span className="text-danger">*</span></label>
              <input type="text" id="username" name="username" className="form-control" placeholder="Tu nombre de usuario" value={form.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico <span className="text-danger">*</span></label>
              <input type="email" id="email" name="email" className="form-control" placeholder="Tu correo electrónico" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña <span className="text-danger">*</span></label>
              <input type="password" id="password" name="password" className="form-control" placeholder="Nueva contraseña" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono <span className="text-danger">*</span></label>
              <input type="tel" id="phone" name="phone" className="form-control" placeholder="Tu número de teléfono" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="role">Rol <span className="text-danger">*</span></label>
              <select id="role" name="role" className="form-control" value={form.role} onChange={handleChange} required>
                <option value="" disabled>Selecciona un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Técnico">Técnico</option>
                <option value="Vendedor">Vendedor</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                <i className="fas fa-save"></i> Guardar Usuario
              </button>
              <button type="button" className="btnreverse-confi" onClick={() => setForm({ username: '', email: '', password: '', phone: '', role: '' })}>
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ConfigPerfil; 