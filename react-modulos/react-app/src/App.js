/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-05-13
  Versión: 1.0.0
*/

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import ResetPassword from './ResetPassword';
import ConfigPerfil from './ConfigPerfil';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/config-perfil', element: <ConfigPerfil /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
