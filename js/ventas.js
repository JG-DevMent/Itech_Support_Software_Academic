document.addEventListener("DOMContentLoaded", () => {
    const enlaces = document.querySelectorAll(".informe-link");
    const btnFiltrar = document.querySelector('.btn-filtrar');
    const fechaDesde = document.getElementById('fechaDesde');
    const fechaHasta = document.getElementById('fechaHasta');
    
    enlaces.forEach(link => {
        link.addEventListener("click", (e) => {
        e.preventDefault(); // evitar que se recargue la página

        const tipo = link.getAttribute("data-informe");

        // Siempre crear un archivo, incluso vacío
        const datos = [
            ["Informe:", tipo],
            ["Fecha", "Descripción", "Valor"]
            // Puedes dejarlo sin datos reales si quieres
        ];

        const hoja = XLSX.utils.aoa_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Informe");

        XLSX.writeFile(libro, `informe_${tipo}.xlsx`);
        });
    });

    // Evento para el botón de filtrar
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            // La funcionalidad existente para filtrar
            alert(`Filtrando desde ${fechaDesde.value} hasta ${fechaHasta.value}`);
        });
    }
});