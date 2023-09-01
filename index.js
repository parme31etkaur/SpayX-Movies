let left_btns = document.querySelectorAll(".left-arrow");
let right_btns = document.querySelectorAll(".right-arrow");
let cardContainers = document.querySelectorAll('.cards');

left_btns.forEach((left_btn, index) => {
    left_btn.addEventListener('click', () => {
        cardContainers[index].scrollLeft -= 140;
    });
});

right_btns.forEach((right_btn, index) => {
    right_btn.addEventListener('click', () => {
        cardContainers[index].scrollLeft += 140;
    });
});

window.addEventListener('scroll', function () {
  const carousel = document.querySelector('#carouselVideoExample');
  const caption = document.querySelector('.carousel-caption');
  const carouselHeight = carousel.clientHeight;
  const scrollTop = window.scrollY;

  const maxScroll = carouselHeight * 0.4; // Maximum scroll distance
  const blurIntensity = (scrollTop / maxScroll) * 10;

   if (scrollTop <= maxScroll) {
    carousel.style.transform = `translateY(${scrollTop * 0.5}px)`; // Adjust the speed of carousel movement
    caption.style.transform = `translateY(${scrollTop * 1}px)`; // Adjust the speed of caption movement
    carousel.style.filter = `blur(${blurIntensity}px)`; // Apply the blur effect
    carousel.classList.add('blurred');
  } else {
    carousel.style.transform = `translateY(${maxScroll * 0.5}px)`; // Keep the carousel at max scroll
    caption.style.transform = `translateY(${maxScroll * 1}px)`; // Keep the caption at max scroll
    carousel.style.filter = 'blur(5px)'; // Keep the carousel blurred at max scroll
    carousel.classList.remove('blurred');
  }
});

///search functionality
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
document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector(
          "body").style.visibility = "hidden";
        document.querySelector(
          "#spinner").style.visibility = "visible";
    } 
    else {
        document.querySelector(
          "#spinner").style.display = "none";
        document.querySelector(
          "body").style.visibility = "visible";
    }
};
