const base_url = "https://api.themoviedb.org/3";
const api_key = "api_key=" + appConfig.apiKey;
const img_url = "https://image.tmdb.org/t/p/w500";
const url = base_url + "/discover/tv?" + api_key;
const genre_url=base_url+"/genre/movie/list?"+api_key;

const space = document.getElementById("space");

const params = new URLSearchParams(window.location.search);
const tvId = params.get('tvId');

if (tvId) {
  getTvDetail(tvId);
}
else {
  console.error('No TV ID found in query parameter');
  window.location.href = 'error.html';

}
const video_url = base_url + "/tv/" + tvId + "?" + api_key + "&append_to_response=casts,videos,images,release";
console.log(video_url);
const similar_url = base_url + "/tv/" + tvId + "/similar?" + api_key;
const tv_reviews = base_url + "/tv/" + tvId + "/reviews?" + api_key;

const ul=document.getElementById('genreList');

const getGenres = function (genreList) {
  const genreDivs = genreList.map(({ name }) => `<div class="genres">${name}</div>`);
  return genreDivs.join("   ");
}

const getReviews = function (reviewList) {
  const newReviewList = [];
  for (let i = 0, len = reviewList.length; i < len && i < 10; i++) {
    const { username } = reviewList[i].author_details;
    newReviewList.push(username);
  }
  console.log(newReviewList);
  return newReviewList;
}
//for animations of section hidden
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
    else {
      entry.target.classList.remove('show');
    }
  });
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


function getTvDetail(tvId) {
  const detail_url = base_url + "/tv/" + tvId + "?" + api_key;
  console.log(detail_url);
  fetch(detail_url)
    .then((res) => res.json())
    .then((data) => {
      const { name, backdrop_path, poster_path, overview, vote_average, first_air_date, number_of_seasons, number_of_episodes } = data;

      document.getElementById("movieTitle").innerText = name;
      document.getElementById("moviePoster").src = img_url + poster_path;
      document.getElementById("movieOverview").innerText = overview;
      document.getElementById("movieRating").innerText = Math.round(vote_average) + "/10";
      document.getElementById("poster").src = img_url + backdrop_path;
      document.getElementById("release_date").innerText = first_air_date;
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error);
      window.location.href = 'error.html';

    });
  console.log(tvId);
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const tvId = card.getAttribute('data-movie-id');
    const detail_url = base_url + "/movie/" + tvId + "?" + api_key;
    console.log(detail_url);
    getTvDetail(tvId);
  });
});

const fetchDataFromServer = function (url, callback, params) {
  fetch(url).then(response => response.json()).then(data => callback(data, params));
}

fetchDataFromServer(video_url, function (tv) {
  const {
    number_of_seasons,
    number_of_episodes,
    genres,
  } = tv;

  console.log(tv);

  const movieDetail = document.createElement("div");
  movieDetail.classList.add("movie-detail");

  movieDetail.innerHTML = `
        
        <div class="getGenre">${getGenres(genres)}</div>
        <hr> 
`;
  const videoDetailsContainer = movieDetail.querySelector(".video-details");

  space.appendChild(movieDetail);

});

fetchDataFromServer(tv_reviews, function (response) {
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
      <% for (const review of Allreviews){ %>
        
      
      <h4 class="review_name">${author}</h4>
      <h4 class="review_rating">Rating: <img src="styles/images/star.png" class="star"> ${rating}/10</h4>
      <span class="username">USERNAME: ${username}</span>
      <p>${content}</p>
      <% } %>
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

