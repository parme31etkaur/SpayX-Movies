const base_url="https://api.themoviedb.org/3";
const api_key="api_key="+appConfig.apiKey;
const img_url="https://image.tmdb.org/t/p/w500";

const movie_url=base_url+"/discover/movie?sort_by=popularity.desc&"+api_key;
const tv_url=base_url+"/discover/tv?sort_by=popularity.desc&"+api_key;

const top_url=base_url+"/movie/top_rated?sort_by=top_rated.desc&"+api_key;
const top_tv_url=base_url+"/tv/top_rated?sort_by=top_rated.desc&"+api_key;

const now_playing=base_url+"/movie/now_playing?"+api_key;
const on_air_tv=base_url+"/tv/on_the_air?"+api_key;
const airing_today_url=base_url+"/tv/airing_today?"+api_key;

const genre_url=base_url+"/genre/movie/list?"+api_key;


const ul=document.getElementById('genreList');
const top_rated_cards=document.getElementById('top_rated_cards');
const popular_cards=document.getElementById('popular_cards');
const now_playing_cards=document.getElementById('current_cards');
const airing_today_cards=document.getElementById('airing_today_cards');

const top_rated_tv_cards=document.getElementById('top_rated_tv_cards');
const popular_tv_cards=document.getElementById('popular_tv_cards');
const now_playing_tv_cards=document.getElementById('current_tv_cards');
const airing_today_tv_cards=document.getElementById('airing_today_tv_cards');

function getMovies(movie_url,category){
    fetch(movie_url).then(res => res.json()).then(data => {
            console.log(data.results);
            showMovies(data.results,category);
        });
}
function showMovies(data,category){
    let container;
    if(category==='top_rated'){
         container=top_rated_cards;
    }
    else if(category==='popular'){
         container=popular_cards;
    }
    else if(category==='now_playing'){
        container=now_playing_cards;
    }
    else if(category==='airing_today'){
        container=airing_today_cards;
    }
    else {
        console.log('Unknown category:', category);
        return; // Exit the function if the category is not recognized
      }

    data.forEach(movie => {
        const {title, poster_path,id} =movie;
        const movieE1=document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML=`
        <a class="card" href="dddddd.html?movieId=${id}" data-movie-id="${id}" >
        <img src="${img_url+poster_path}" alt="${title}" class="poster" />
        <h4 class="title">${title}</h4>
        </a>
        `;
      container.appendChild(movieE1);
    });
}

getMovies(movie_url,'popular');
getMovies(top_url,'top_rated');
getMovies(now_playing,'now_playing');


function getTv(tv_url,category){
    fetch(tv_url).then(res => res.json()).then(data => {
            showTv(data.results,category);
        });
}

function showTv(data,category){
    let container;
    if(category==='top_rated_tv'){
         container=top_rated_tv_cards;
    }
    else if(category==='popular_tv'){
         container=popular_tv_cards;
    }
    else if(category==='now_playing_tv'){
        container=now_playing_tv_cards;
    }
    else if(category==='airing_today_tv'){
        container=airing_today_tv_cards;
    }
    else {
        console.log('Unknown category:', category);
        return; // Exit the function if the category is not recognized
      }

    data.forEach(tv => {
        const {name, poster_path,id} =tv;
        const tvE1=document.createElement('div');
        tvE1.classList.add('tv');
        tvE1.innerHTML=`
        <a class="card" href="tv.html?tvId=${id}" data-movie-id="${id}" >
        <img src="${img_url+poster_path}" alt="${name}" class="poster" />
        <h4 class="title">${name}</h4>
        </a>
        `;
      container.appendChild(tvE1);
    });
}

getTv(tv_url,'popular_tv');
getTv(top_tv_url,'top_rated_tv');
getTv(on_air_tv,'now_playing_tv');
getTv(airing_today_url,'airing_today_tv');


document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const tvId = card.getAttribute('data-movie-id');
      getTvDetail(tvId);
      console.log('hello');
    });
});
//genre functionality
getGenre(genre_url);

function getGenre(movie_url){
    fetch(movie_url).then(res => res.json()).then(data => {
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
