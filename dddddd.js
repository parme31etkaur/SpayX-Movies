const base_url = "https://api.themoviedb.org/3";
const api_key = "api_key="+appConfig.apiKey;
const img_url = "https://image.tmdb.org/t/p/w500";
const url = base_url + "/discover/movie?" + api_key;
const genre_url=base_url+"/genre/movie/list?"+api_key;

const space = document.getElementById("space");

const params = new URLSearchParams(window.location.search);
const movieId = params.get('movieId');

const ul=document.getElementById('genreList');

if (movieId) {
  getMovieDetail(movieId);
}
else {
  console.error('No movie ID found in query parameter');
  window.location.href = 'error.html';
}
const video_url = base_url + "/movie/" + movieId + "?" + api_key + "&append_to_response=casts,videos,images,release";
const similar_url = base_url + "/movie/" + movieId + "/similar?" + api_key;
const movie_reviews = base_url + "/movie/" + movieId + "/reviews?" + api_key;

const getGenres = function (genreList) {
  const genreDivs = genreList.map(({ name }) => `<div class="genres">${name}</div>`);
  return genreDivs.join("   ");
}

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name } of directors) directorList.push(name);
  console.log(crewList);

  return directorList.join(", ");
}
//return only trailers and teasers as array
const filterVideos = function (videoList) {
  return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
}
//for animations of section hidden
const observer=new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
    }
    else{
      entry.target.classList.remove('show');
    }
  });
});
const hiddenElements=document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

function getMovieDetail(movieId) {
  const detail_url = base_url + "/movie/" + movieId + "?" + api_key;
  fetch(detail_url)
    .then((res) => res.json())
    .then((data) => {
      const { title, backdrop_path, poster_path, runtime,overview, vote_average, release_date } = data;
      console.log(data);
      document.getElementById("movieTitle").innerText = title;
      document.getElementById("moviePoster").src = img_url + poster_path;
      document.getElementById("movieOverview").innerText = overview;
      document.getElementById("movieRating").innerText = Math.round(vote_average) + "/10";
      document.getElementById("poster").src = img_url + backdrop_path;
      document.getElementById("release_date").innerText = release_date;
      document.getElementById("runtime").innerText=runtime+"min";
    })
    
    .catch((error) => {
      console.error("Error fetching movie details:", error);
      window.location.href = 'error.html';
    });
  console.log(movieId);
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const movieId = card.getAttribute('data-movie-id');
    const detail_url = base_url + "/movie/" + movieId + "?" + api_key;
    console.log(detail_url);
    getMovieDetail(movieId);
  });
});

const fetchDataFromServer = function (url, callback, params) {
  fetch(url).then(response => response.json()).then(data => callback(data, params));
}

fetchDataFromServer(video_url, function (movie) {
  const {
    genres,
    casts: { cast, crew },
    videos: { results: videos }
  } = movie;

  console.log(movie);

  const movieDetail = document.createElement("div");
  movieDetail.classList.add("movie-detail");

  const castListHtml = cast.map(({ name, profile_path }) => `
                                        <div class="cast-item">
                                          <img src="${img_url}${profile_path}" alt="${name}" id="castsImg">
                                          <p>${name}</p>
                                       </div>`).join("");

  movieDetail.innerHTML = `
        <div class="getGenre">${getGenres(genres)}</div>
        <hr>
        <video class="glitters" autoplay muted controls loop>
            <source src="vedio/glitters.mp4" type="video/mp4" />
        </video>
        <h4 class="details-text">Starring:-</h4>
        <div class="cast-list">${castListHtml}</div>
        <h4 class="details-text">Directors:-</h4>
        <p class="director-name">${getDirectors(crew)}</p>
        <hr> 
      
        <h3 class="details-text">Trailers and clips</h3>
        
        <div class="videoDetailsContainer">
        <div class="video-details"></div>
        </div>
`;
  const videoDetailsContainer = movieDetail.querySelector(".video-details");

  for (const { key, name } of filterVideos(videos)) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");
    videoCard.innerHTML = `
  <iframe width="600" height="400" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" allowfullscreen="1" title="${name}" class="img-cover" loading ="lazy"></iframe>
  `;

    videoDetailsContainer.appendChild(videoCard);
  }
  space.appendChild(movieDetail);

});
fetchDataFromServer(movie_reviews, function (response) {
  const { results } = response;

  const Reviews = document.createElement("div");
  Reviews.classList.add("review_details");

  let reviewsHtml = '';

  for (const review of results) {
    const {
      author,
      author_details: { username, rating },
      content,
    } = review;

    reviewsHtml += `
      <div class="review_container">
      <h4 class="review_name">${author}</h4>
      <h4 class="review_rating">Rating: <img src="styles/images/star.png" class="star"> ${rating}/10</h4>
      <span class="username">USERNAME: ${username}</span>
      <p>${content}</p>
      </div>
    `;
  }

  Reviews.innerHTML = reviewsHtml;
  const review = document.getElementById("review");
  review.appendChild(Reviews);

  $(document).ready(function () {
    $(".review_container").slice(0, 4).show();
    $("#loadMore").on("click", function (e) {
      e.preventDefault();
      $(".review_container:hidden").slice(0, 4).slideDown();
      if ($(".review_container:hidden").length == 0) {
        $("#loadMore").text(" ").addClass("noContent");
      }
    });

  });
});

getGenre(genre_url);

function getGenre(movie_url){
    fetch(movie_url).then(res => res.json()).then(data => {
            console.log(data.genres);
            showGenre(data.genres);
        });    
}

function showGenre(data){
    ul.innerHTML='';
    data.forEach(movie => {
        const {id,name} =movie;
        const movieE2=document.createElement('li');
        movieE2.classList.add('movie');
        movieE2.innerHTML=`
        <a class="dropdown-item" href="genre.html?genreId=${id}" data-genre-id="${id}">${name}</a>
        `;
        ul.appendChild(movieE2);
    });
}

//search functionality
const searchForm = document.getElementById('search');
const searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    const searchTerm = searchInput.value;
    if (searchTerm) {
        searchMovies(searchTerm);
    }
});

searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page
    const searchTerm = searchInput.value;
    if (searchTerm) {
        searchTv(searchTerm);
    }
});

function searchMovies(query) {
  const searchUrl = base_url + '/search/movie?' + api_key + '&query=' + encodeURIComponent(query);
  
  fetch(searchUrl)
      .then(res => res.json())
      .then(data => {
          const searchResults = data.results;
          if (searchResults.length > 0) {
              const originalMovie = searchResults[0];
          const searchResultIds = searchResults.map(result => result.id).join(',');
          const searchUrlParams = new URLSearchParams({
              query: query,
              movieIds: searchResultIds
          });
          console.log(originalMovie);
          fetchSimilarMovies(searchUrlParams.toString(), originalMovie);
          
          window.location.href = 'search.html?' +searchUrlParams.toString();
      }else{
          console.log('no search results found.');
      }
  
      })
      .catch(error => {
          console.error('Error fetching search results:', error);
      });
}
function fetchSimilarMovies(query, originalMovie) {
  const similarMoviesUrl = base_url + '/movie/' + originalMovie.id + '/similar?' + api_key;

  fetch(similarMoviesUrl)
      .then(res => res.json())
      .then(data => {
          showSimilarMovies(data.results, originalMovie);
      })
      .catch(error => {
          console.error('Error fetching similar movies:', error);
      });
}
function searchTv(query) {
  const searchUrl = base_url + '/search/tv?' + api_key + '&query=' + encodeURIComponent(query);
  
  fetch(searchUrl)
      .then(res => res.json())
      .then(data => {
          const searchResults = data.results;
          if (searchResults.length > 0) {
          const originalTv = searchResults[0];
          const searchResultIds = searchResults.map(result => result.id).join(',');
          const searchUrlParams = new URLSearchParams({
              query: query,
              tvIds: searchResultIds
          });
          console.log(originalTv);
          fetchSimilarTv(searchUrlParams.toString(), originalTv);
          
          window.location.href = 'searchTv.html?' +searchUrlParams.toString();
      }else{
          console.log('no search results found.');
      }
  
      })
      .catch(error => {
          console.error('Error fetching search results:', error);
      });
}
function fetchSimilarTv(query, originalTv) {
  const similarTvUrl = base_url + '/tv/' + originalTv.id + '/similar?' + api_key;

  fetch(similarTvUrl)
      .then(res => res.json())
      .then(data => {
          showSimilarTv(data.results, originalTv);
      })
      .catch(error => {
          console.error('Error fetching similar movies:', error);
      });
}  

