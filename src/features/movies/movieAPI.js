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
   // ensure url startwith 'https', otherwise it will be blocked in production
   // as an optimization, this can be done once when the movie data is returned
   actorUrl =  actorUrl.replace(/https?:\/\//i, 'https://');
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
 