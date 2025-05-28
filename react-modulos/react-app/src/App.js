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
