document.addEventListener("DOMContentLoaded", () => {
    const enlaces = document.querySelectorAll(".informe-link");

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
});