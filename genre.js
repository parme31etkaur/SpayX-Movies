const genreDropdown = document.getElementById('genreList');
const movieListSection = document.getElementById('movie-list');
const tvListSection = document.getElementById('tv-list');

const selectedGenreId = new URLSearchParams(window.location.search).get('genreId');
const selectedGenre = localStorage.getItem('selectedGenre');
if (selectedGenreId) {
    fetchMoviesByGenre(selectedGenreId);
    fetchTvByGenre(selectedGenreId);
    if (selectedGenre) {
    const genreTitle = document.getElementById('genreTitle');
    genreTitle.textContent = `Genre: ${selectedGenre}`; 
}
}
      
function fetchMoviesByGenre(genreId) {
    console.log('Fetching movies for genreId:', genreId);
    fetch(`${base_url}/discover/movie?${api_key}&sort_by=popularity.desc&with_genres=${genreId}`)
        .then(response => response.json())
        .then(data => {
            movieListSection.innerHTML = ''; 
            data.results.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie');
                movieElement.innerHTML = `
                    <a class="search-card" href="dddddd.html?movieId=${movie.id}" data-movie-id="${movie.id}">
                        <img src="${img_url + movie.poster_path}" alt="${movie.title}" class="poster" />
                        <h4 class="search-title">${movie.title}</h4>
                    </a>
                `;
                movieListSection.appendChild(movieElement);
            })
            .catch(error => console.error('Fetch error:', error));
        });
}
function fetchTvByGenre(genreId) {
    console.log('Fetching tv for genreId:', genreId);
    fetch(`${base_url}/discover/tv?${api_key}&sort_by=popularity.desc&with_genres=${genreId}`)
        .then(response => response.json())
        .then(data => {
            tvListSection.innerHTML = ''; 
            data.results.forEach(tv => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('tv');
                movieElement.innerHTML = `
                    <a class="search-card" href="tv.html?tvId=${tv.id}" data-movie-id="${tv.id}">
                        <img src="${img_url + tv.poster_path}" alt="${tv.name}" class="poster" />
                        <h4 class="search-title">${tv.name}</h4>
                    </a>
                `;
                tvListSection.appendChild(movieElement);
            })
            .catch(error => console.error('Fetch error:', error));
        });
}

genreDropdown.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('dropdown-item')) {
        const selectedGenreId = target.getAttribute('data-genre-id');
        fetchMoviesByGenre(selectedGenreId);
        const selectedGenreName = target.textContent;
        localStorage.setItem('selectedGenre', selectedGenreName);
    }
});
