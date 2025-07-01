import React, { useEffect, useState, useRef } from 'react';
import './css/sb-admin-2.min.css';
import './css/custom.css';
import './vendor/fontawesome-free/css/all.min.css';
import * as XLSX from 'xlsx';

const logo = require('./../public/img/logo-itech-support.png');

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteEditandoId, setClienteEditandoId] = useState(null);
  const [form, setForm] = useState({ nombre: '', cedula: '', telefono: '', correo: '', direccion: '' });
  const formRef = useRef();

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  const limpiarFormulario = () => {
    setForm({ nombre: '', cedula: '', telefono: '', correo: '', direccion: '' });
    setModoEdicion(false);
    setClienteEditandoId(null);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.id.replace('Cliente', '')]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && clienteEditandoId) {
        const response = await fetch(`http://localhost:4000/api/clientes/${clienteEditandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!response.ok) throw new Error('Error actualizando cliente');
        alert('Cliente actualizado correctamente');
      } else {
        const response = await fetch('http://localhost:4000/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!response.ok) {
          const error = await response.json();
          alert(error.error || 'Error creando cliente');
          return;
        }
        alert('Cliente guardado correctamente');
      }
      obtenerClientes();
      setModalVisible(false);
      limpiarFormulario();
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  const handleEditar = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/clientes/${id}`);
      if (!response.ok) throw new Error('Cliente no encontrado');
      const cliente = await response.json();
      setForm(cliente);
      setModoEdicion(true);
      setClienteEditandoId(id);
      setModalVisible(true);
    } catch (error) {
      alert('Error al cargar cliente para editar.');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/clientes/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error eliminando cliente');
        obtenerClientes();
      } catch (error) {
        alert('Error de conexión con el servidor.');
      }
    }
  };

  const handleBuscar = async () => {
    if (busqueda.trim() === '') {
      obtenerClientes();
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/clientes');
      const data = await response.json();
      const filtrados = data.filter(cliente => cliente.cedula.toLowerCase().includes(busqueda.trim().toLowerCase()));
      setClientes(filtrados);
    } catch (error) {
      alert('Error de conexión con el servidor.');
    }
  };

  const handleExportar = () => {
    if (clientes.length === 0) {
      alert('No hay clientes para exportar.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(clientes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'clientes.xlsx');
  };

  const cerrarSesion = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div id="wrapper">
      <ul className="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
        <div className="logo-container">
          <a href="home.html">
            <img src={logo} alt="ITECH SUPPORT" />
          </a>
        </div>
        <hr className="sidebar-divider my-0" />
        <li className="nav-item">
          <a className="nav-link" href="home.html">
            <i className="fas fa-home"></i>
            <span>Inicio</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="gestion-reparacion.html">
            <i className="fas fa-tools"></i>
            <span>Gestión Reparación</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="verificar.html">
            <i className="fas fa-check-circle"></i>
            <span>Verificar</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="ventas-informes.html">
            <i className="fas fa-chart-line"></i>
            <span>Ventas e informes</span>
          </a>
        </li>
        <li className="nav-item active">
          <a className="nav-link" href="clientes.html">
            <i className="fas fa-users"></i>
            <span>Clientes</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="inventario.html">
            <i className="fas fa-boxes"></i>
            <span>Inventario</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="pago-facturacion.html">
            <i className="fas fa-credit-card"></i>
            <span>Pago y Facturación</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="ayuda-soporte.html">
            <i className="fas fa-question-circle"></i>
            <span>Ayuda y soporte</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="configuracion.html">
            <i className="fas fa-cog"></i>
            <span>Ajustes</span>
          </a>
        </li>
        <hr className="sidebar-divider d-none d-md-block" />
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={cerrarSesion}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Cerrar sesión</span>
          </a>
        </li>
      </ul>
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <nav className="navbar-title">
            <button id="sidebarToggleCustom" className="btn-toggle-sidebar">
              <i className="fas fa-bars"></i>
            </button>
            <h1>Itech Support</h1>
          </nav>
          <div className="card-box-center">
            <div className="card-body">
              <h1 className="text-h1">Clientes</h1>
              <div className="busqueda-cliente">
                <input type="text" id="clienteBusqueda" className="form-control" placeholder="Cédula cliente" value={busqueda} onChange={e => setBusqueda(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleBuscar(); }} />
                <button id="btnCliente" className="btn btn-primary" onClick={handleBuscar}>Buscar</button>
                <button id="btnLimpiarBusqueda" className="btn btn-secondary" onClick={() => { setBusqueda(''); obtenerClientes(); }}>
                  <i className="fas fa-eraser"></i> Limpiar
                </button>
                <div>
                  <button className="btn-addcliente" onClick={() => { limpiarFormulario(); setModalVisible(true); }}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-box-center">
            <div className="card-body">
              <p>Clientes Registrados</p>
              <div className="row mb-2">
                <div className="col-md-2 col-sm-12 text-right mb-2">
                  <button id="exportarClientes" className="btn btn-success w-100" onClick={handleExportar}>
                    <i className="fas fa-file-excel"></i> Exportar a XLSX
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-striped mt-2" id="tablaClientes">
                  <thead className="table-color">
                    <tr>
                      <th>Nombre</th>
                      <th>Cédula</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Dirección</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(cliente => (
                      <tr key={cliente.id}>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.cedula}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.correo.length > 20 ? <span className="email-text">{cliente.correo}</span> : cliente.correo}</td>
                        <td>{cliente.direccion}</td>
                        <td>
                          <div className="btn-group-actions">
                            <button className="btn btn-sm btn-warning editar-btn" onClick={() => handleEditar(cliente.id)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-danger eliminar-btn" onClick={() => handleEliminar(cliente.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Agregar/Editar Cliente */}
      {modalVisible && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modoEdicion ? 'Editar Cliente' : 'Agregar Cliente'}</h5>
                <button type="button" className="close" onClick={() => setModalVisible(false)} aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form id="formCliente" ref={formRef} onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="nombreCliente" className="form-control" placeholder="Nombre del cliente" required value={form.nombre} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Cédula <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="cedulaCliente" className="form-control" placeholder="Cédula" required value={form.cedula} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Teléfono <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="telefonoCliente" className="form-control" placeholder="Número de teléfono" required value={form.telefono} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Correo <span style={{ color: 'red' }}>*</span></label>
                    <input type="email" id="correoCliente" className="form-control form-control-user" placeholder="Correo electrónico" required value={form.correo} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Dirección <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" id="direccionCliente" className="form-control" placeholder="Dirección" required value={form.direccion} onChange={handleInputChange} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" id="btnGuardarCliente">Guardar Cliente</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes; 