import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
   selectMovie,
   selectMovies,
   selectCast,
   movieListAsync,
   moviesStatus,
   fetchCast,
   castStatus,
   sortCast,
   sortBy,
   selectCastSortSettings,
   filterCast,
 } from './movieSlice';

 export function Movies() {
    const movies = useSelector(selectMovies);
    const status = useSelector(moviesStatus);
    const cast = useSelector(selectCast);
    const loadingCast = useSelector(castStatus);
    const dispatch = useDispatch();

    useEffect(() => {
      if (status === 'idle' && !movies.length) {
        dispatch(movieListAsync())
      }
    }, [status, movies, dispatch]);

    console.log('cast', cast);

    return (
      <>
       <select 
         name="movies" 
         id="movie-select"
         onChange={(e) => {
            const i = Number(e.target.value);
            if (i >= 0) {
               const movie = movies[i]
               dispatch(selectMovie(movie));
               movie.characters.forEach((url) => dispatch(fetchCast(url)));
            }
         }}
      >
         <option value="-1">--Please choose an option--</option>
         {movies.map((movie, index) => (
            <option value={index} key={index}>{movie.title}</option>))}
       </select>

       <table>
          <thead>
             <tr>
                <td></td>
                <td>Filter By Gender</td>
                <td>
                  <select
                     onChange={(e) => {
                        dispatch(filterCast({ by: 'gender', val: e.target.value }))
                     }}
                  >
                     {[
                        ['All', 'all'], 
                        ['Male', 'male'], 
                        ['Female', 'female']
                     ].map(([text, value], index) => (
                        <option value={value} key={index}>{text}</option>
                     ))}
                </select>
                </td>
                
             </tr>
            <tr>
               <th
                  onClick={() => dispatch(sortCast('name'))}
               >
                  Name
               </th>
               <th>Gender</th>
               <th
                  onClick={() => dispatch(sortCast('height'))}
               >
                  Height 
               </th>
            </tr>
          </thead>
          <tbody>
            {cast.map((actor, index) => (
               <tr key={index}>
                  <td>{actor.name}</td>
                  <td>{actor.gender === 'male' ? '♂' : (actor.gender === 'female' ? '♀' : '-') }</td>
                  <td>{isNaN(actor.height) ? '-' : actor.height}</td>
               </tr>
            ))}
            {loadingCast ? 
               (<tr><td>Loading...</td></tr>)
               : null
            }
         </tbody>
       </table>
      </>
    )
 }
 