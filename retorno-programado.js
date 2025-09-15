document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona o container do calendário
    const calendarContainer = document.getElementById('calendar-container');

    if (calendarContainer) {
        // Configurações do flatpickr
        const options = {
            // "inline: true" faz o calendário aparecer diretamente na página
            inline: true, 
            // Define a localidade para Português (requer o script de tradução)
            locale: "pt", 
            // Habilita (marca) apenas as datas que nos interessam
            enable: [
                {
                    from: "2025-09-10",
                    to: "2025-09-10"
                },
                 {
                    from: "2025-09-25",
                    to: "2025-09-25"
                }
            ],
            // Função que é executada para cada dia renderizado no calendário
            onDayCreate: function(dObj, dStr, fp, dayElem){
                // Adiciona classes CSS customizadas para estilizar os dias
                if (dayElem.dateObj.getDate() === 10) {
                    dayElem.classList.add("vencido");
                }
                if (dayElem.dateObj.getDate() === 25) {
                     dayElem.classList.add("a-vencer");
                }
            }
        };

        // Inicializa o calendário
        flatpickr(calendarContainer, options);
    }
});