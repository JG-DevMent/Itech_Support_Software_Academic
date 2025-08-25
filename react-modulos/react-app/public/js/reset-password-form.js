const params = new URLSearchParams(window.location.search);
const token = params.get('token');

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarClave = document.getElementById('confirmarClave').value;

    if (nuevaClave !== confirmarClave) {
    alert("Las contraseñas no coinciden");
    return;
    }

    const res = await fetch('http://localhost:4000/api/usuarios/confirm-reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, nuevaClave })
    });

    const data = await res.json();
    alert(data.mensaje || data.error);

    if (res.ok) {
    window.location.href = "/"; // volver al login
    }
});