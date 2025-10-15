/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-08-13
  Versión: 1.0.0
*/

import React, { useState } from 'react';
import './css/sb-admin-2.min.css';
import './css/custom.css';
import './vendor/fontawesome-free/css/all.min.css';

const logo = require('./../public/img/logo-itech-support.png');
const chatIcon = require('./../public/img/chat-icon.png');

function AyudaSoporte() {
  const [chatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible((prev) => !prev);
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
        <li className="nav-item">
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
        <li className="nav-item active">
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
      <div id="content-wrapper">
        <div id="content">
          <nav className="navbar-title">
            <button id="sidebarToggleCustom" className="btn-toggle-sidebar">
              <i className="fas fa-bars"></i>
            </button>
            <h1>Itech Support</h1>
          </nav>
          <div className="card-box">
            <div className="card-body">
              <h1 className="text-h2">¿Necesitas Ayuda?</h1>
              <p>Para cualquier consulta o soporte técnico, no dudes en contactarnos a través de nuestro chat en línea o por correo electrónico. Estamos aquí para ayudarte.</p>
              <div className="chatbot-container">
                <div className="chatbot-toggle" onClick={toggleChat}>
                  <img src={chatIcon} alt="Chat Icon" />
                </div>
                <div className="chatbot-box" id="chatBox" style={{ display: chatVisible ? 'flex' : 'none' }}>
                  <div className="chatbot-header">
                    Chat de Soporte
                    <span className="chatbot-close" onClick={toggleChat}>✖</span>
                  </div>
                  <div className="chatbot-messages">
                    <div className="chatbot-message bot">¡Hola! ¿En qué puedo ayudarte?</div>
                  </div>
                  <div className="chatbot-input">
                    <input type="text" placeholder="Escribe un mensaje..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AyudaSoporte; 