/*
  Proyecto: Itech Support
  Autor: Juan Guillermo Ramírez C
  Correo: jgrc20042507@gmail.com
  GitHub: github.com/JG-DevMent/
  Fecha: 2025-08-13
  Versión: 1.0.0
*/

// Utilidades para manejo de autenticación JWT en React

// Función para obtener el token JWT del sessionStorage
export const getAuthToken = () => {
    return sessionStorage.getItem('jwtToken');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    const token = getAuthToken();
    return token !== null && token !== undefined;
};

// Función para obtener los headers de autorización para las peticiones
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Función para hacer logout
export const logout = () => {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('currentUser');
    window.location.href = '/index.html';
};

// Función para verificar si el token ha expirado
export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Función para verificar y renovar la sesión si es necesario
export const checkSession = () => {
    const token = getAuthToken();
    if (token && isTokenExpired(token)) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        logout();
        return false;
    }
    return true;
};

// Hook personalizado para verificar autenticación en componentes
export const useAuth = () => {
    const checkAuth = () => {
        if (!isAuthenticated()) {
            window.location.href = '/index.html';
            return false;
        }
        return checkSession();
    };

    return {
        isAuthenticated: isAuthenticated(),
        getAuthToken,
        getAuthHeaders,
        logout,
        checkAuth
    };
};
