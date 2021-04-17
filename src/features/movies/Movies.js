import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
   selectMovie,
   selectMovies,
   movieListAsync,
   moviesStatus,
   activeMovieSelector,
} from './movieSlice';
import {
   fetchCastMemberInfo,
   resetCastList,
} from '../cast/castSlice';
 import   './Movie.css';

 export function Movies() {
    const movies = useSelector(selectMovies);
    const status = useSelector(moviesStatus);
    const selectedMovie = useSelector(activeMovieSelector);
    const dispatch = useDispatch();

    useEffect(() => {
      if (status === 'not_loaded' && !movies.length) {
        dispatch(movieListAsync())
      }
    }, [status, movies, dispatch]);

    return (
      <>
      <header>
         <select 
         disabled={!movies.length}
            name="movies" 
            id="movie-select"
            onChange={(e) => {
               const i = Number(e.target.value);
               if (i >= 0) {
                  const movie = movies[i]
                  dispatch(selectMovie(movie));
                  dispatch(resetCastList());
                  movie.characters.forEach((url) => dispatch(fetchCastMemberInfo(url)));
               }
            }}
         >
            <option value="-1">
               {!movies.length ? "Loading Movies" : "Please Choose A Movie Title"}
               </option>
            {movies.map((movie, index) => (
               <option value={index} key={index}>{movie.title}</option>))}
         </select>
      </header>
       
      <div className='marquee'>
         <div>
            <span>
               {selectedMovie && selectedMovie.opening_crawl}
            </span>
         </div>
      </div>
      </>
    )
 }
