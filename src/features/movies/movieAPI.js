export function fetchMovies() {
   return fetch('https://swapi.dev/api/films')
       .then(response => {
          return response.json();
       })
       .then(data => {
         return data.results;
       })
       .catch((err) => {
         return err;
       });
}

export function fetchActorInfo(actorUrl) {
   return fetch(actorUrl)
      .then(response => {
         return response.json();
      })
      .then(data => {
      return data;
      })
      .catch((err) => {
         return err;
      });
}
 