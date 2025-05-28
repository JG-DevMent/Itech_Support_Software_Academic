document.addEventListener('DOMContentLoaded', function() {
    // Formulario de restablecimiento de contraseña
    const resetForm = document.getElementById('resetPasswordForm');
    
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar si existe un usuario con ese correo
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            alert('Se ha enviado un correo con instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.');
            // En una implementación real, aquí se enviaría un correo
            
            // Redirigir al login después de unos segundos
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            alert('No se encontró ninguna cuenta asociada a este correo electrónico.');
        }
    });
}); 