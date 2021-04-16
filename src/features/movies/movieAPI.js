const api = process.env.NODE_ENV === 'production' ? 'https://swapi.dev/api/films' : '/films'

export function fetchMovies() {
   console.log("fetching movies");
   return fetch('https://swapi.dev/api/films')
       .then(response => {
          return response.json();
       })
       .then(data => {
          console.log("movie data", data);
         return data.results;
       })
       .catch((err) => {
          console.log("fetching movies error", err);
       });
}

export function fetchMovieCast(movie) {
   console.log('we need to fetch the cast')
}
 