import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
   selectMovie,
   selectMovies,
   movieListAsync,
   moviesStatus,
   fetchCast,
 } from './movieSlice';

 export function Movies() {
    const movies = useSelector(selectMovies);
    const status = useSelector(moviesStatus);
    const dispatch = useDispatch();

    useEffect(() => {
      if (status === 'idle' && !movies.length) {
        dispatch(movieListAsync())
      }
    }, [status, movies, dispatch]);

    return (
       
       <select 
         name="movies" 
         id="movie-select"
         onChange={(e) => {
            const i = Number(e.target.value);
            if (i >= 0) {
               const movie = movies[i]
               dispatch(selectMovie(movie));
               dispatch(fetchCast(movie));
            }
         }}
      >
         <option value="-1">--Please choose an option--</option>
         {movies.map((movie, index) => (
            <option value={index}>{movie.title}</option>))}
       </select>
    )
 }
 