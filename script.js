const seriesContainer = document.getElementById('seriesContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

async function fetchSeries(query = 'popular') {
    // Feedback visual para el usuario
    seriesContainer.innerHTML = '<p class="loading">Buscando datos en el servidor...</p>';
    
    try {
        // Llamada a la API de TVMaze
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        
        // Si la respuesta no es 200 OK, lanzamos error
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const data = await response.json();
        
        console.log("Datos recibidos:", data); // Para depuración
        displaySeries(data);

    } catch (error) {
        // Este es el mensaje que ves
        seriesContainer.innerHTML = `
            <div style="color: #ff4444; padding: 20px; text-align: center;">
                <p>Error al cargar las series.</p>
                <small>${error.message}</small>
            </div>`;
        console.error("Detalle del error:", error);
    }
}

function displaySeries(seriesList) {
    seriesContainer.innerHTML = ''; 

    if (seriesList.length === 0) {
        seriesContainer.innerHTML = '<p>No se encontraron series con ese nombre.</p>';
        return;
    }

    seriesList.forEach(item => {
        const { show } = item; // Destructuring (más profesional)
        const card = document.createElement('div');
        card.className = 'series-card';

        // Gestión de datos faltantes
        const imgUrl = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Poster';
        const rating = show.rating.average || 'N/A';
        const summary = show.summary ? show.summary.substring(0, 80) + '...' : 'Sin descripción disponible.';

        card.innerHTML = `
            <img src="${imgUrl}" alt="${show.name}" loading="lazy">
            <div class="series-info">
                <h3>${show.name}</h3>
                <p class="rating"> ${rating}</p>
                <div class="summary">${summary}</div>
            </div>
        `;
        seriesContainer.appendChild(card);
    });
}

// Escuchadores de eventos
searchButton.addEventListener('click', () => fetchSeries(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchSeries(searchInput.value);
});

// Inicio inicial
fetchSeries('Breaking bad');