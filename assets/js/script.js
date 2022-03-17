//jQuery variable elements
var searchBtn = $('#searchBtn');
var trailers = $('#trailers');
var upComing = $('#upComing');

//global variables
const api_key = '1fc2de251859dcddc136157f2a89acbe';

// API functions start gathering movie information on click
searchBtn.on('click', async function (event) {
    event.preventDefault();

    let genre = await genresLookup() // Genre ID's   

    let movieName = $('#searchInput').val();
    let movieResult = await movieLookup(movieName); // Movie data for movie search

    let castResult = await creditLookup(movieResult.results[0].id) // Retrieve cast information

    let videoResult = await videoLookup(movieResult.results[0].id) // Retrieve video info for movie being searched
    let videoTrailer = videoResult.results.filter(function (item) {
        return item.type == 'Trailer'
    })

    let sneakResult = await upcomingMovies(); // Retrieve list of upcoming movies 

    let sneakPreview = await videoLookup(sneakResult.results[(Math.floor(Math.random()*10))].id) // Retrieve random upcoming movie trailer
    let previewResult = sneakPreview.results.filter(function (item) {
        return item.type == 'Trailer'
    })

    // Images for thumbnail and search results pages
    $('body').append($('<img>', { src: 'https://image.tmdb.org/t/p/' + 'w154' + movieResult.results[0].poster_path }))
    $('body').append($('<img>', { src: 'https://image.tmdb.org/t/p/' + 'w342' + movieResult.results[0].poster_path }))

    // Trailers for both selected movie and upcoming movie
    trailers.attr('src', 'https://www.youtube.com/embed/' + videoTrailer[videoTrailer.length - 1].key)
    upComing.attr('src', 'https://www.youtube.com/embed/' + previewResult[previewResult.length - 1].key)
})

// Param URL and api_key + any parameters
function paramApiUrl(url, params) {
    params === null ? params = {} : params
    params = Object.assign({ api_key: api_key }, params)
    return url + jQuery.param(params)
}

// Fetch function to process the fetch using prepared string as arguement
async function apiRequest(requestString) {
    return fetch(requestString)
        .then(function (response) {
            return response.text()
        })
        .then(function (text) {
            return JSON.parse(text)
        })
}

// API for Genre ID's
async function genresLookup() {
    let apiSite = 'https://api.themoviedb.org/3/genre/movie/list?';
    let requestUrl = paramApiUrl(apiSite)
    return apiRequest(requestUrl)
}

// Fetch API data for movie inputed into search
async function movieLookup(movieName) {
    let apiSite = 'https://api.themoviedb.org/3/search/movie?'
    let requestUrl = paramApiUrl(apiSite, { query: movieName })
    return apiRequest(requestUrl)
}

// Fetch API cast data by movie_ID pulled from movieResult
async function creditLookup(movie_id) {
    let apiSite = 'https://api.themoviedb.org/3/movie/' + movie_id + '/credits?';
    let requestUrl = paramApiUrl(apiSite)
    return apiRequest(requestUrl)
}

// Fetch API movie trailer data by movie_id from movieResult
async function videoLookup(movie_id) {
    let apiSite = 'https://api.themoviedb.org/3/movie/' + movie_id + '/videos?';
    let requestUrl = paramApiUrl(apiSite)
    return apiRequest(requestUrl)
}

// Fetch API list of upcoming movies
async function upcomingMovies() {
    let apiSite = 'https://api.themoviedb.org/3/movie/upcoming?';
    let requestUrl = paramApiUrl(apiSite)
    return apiRequest(requestUrl)
}

// *** Console.log statements for testing ***
// console.log(genre) // (genresLookup)
// console.log(movieResult) // (movieLookup)
// console.log(castResult) // (creditLookup)
// console.log(videoResult) // (videoLookup)
// console.log(sneakResult.results[0].id) //(upcomingMovies)
// console.log(sneakPreview) // (VideoLookup)
// console.log(videoTrailer[videoTrailer.length - 1].key) // (videoTrailer) Key