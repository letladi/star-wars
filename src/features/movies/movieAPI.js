export function fetchMovies() {
   return fetch('https://swapi.dev/api/films')
       .then(response => {
          return response.json();
       })
       .then(data => {
         return data.results;
       })
       .catch((err) => {
         // TODO: handle error for fetching movie
       });
}

export function fetchMovieCast(actorUrl) {
   return fetch(actorUrl)
      .then(response => {
         return response.json();
      })
      .then(data => {
      return data;
      })
      .catch((err) => {
         // TODO: handle error for fetching cast
      });
}
 