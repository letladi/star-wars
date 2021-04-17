import React, { useEffect } from 'react';
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
   castCountSelector,
   filterCast,
   heightTotalSelector,
   activeMovieSelector,
} from './movieSlice';
 import styles from './Movie.module.css';

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
                  movie.characters.forEach((url) => dispatch(fetchCast(url)));
               }
            }}
         >
            <option value="-1">
               {!movies.length ?
                  "Loading Movies" :
                  "Please Choose A Movie Title"
               }
               
               </option>
            {movies.map((movie, index) => (
               <option value={index} key={index}>{movie.title}</option>))}
         </select>
      </header>
       

      <div className={styles.marquee}>
         <div className={styles.marqueeDiv}>
            <span className={styles.marqueeSpan}>
               {selectedMovie && selectedMovie.opening_crawl}
            </span>
         </div>
      </div>

      <Cast />
      </>
    )
 }

export function Cast() {
   const castCount = useSelector(castCountSelector);
   const [heightTotalInCM, heightTotalInInches, heightTotalInFt] = useSelector(heightTotalSelector);
   const cast = useSelector(selectCast);
   const loadingCast = useSelector(castStatus);
   const dispatch = useDispatch();

   if (!cast.length) return null;

   return (
     <>
      <table style={{ backgroundColor: 'rbga(225, 173, 1, 1)' }}>
         <thead>
            <tr>
               <td colSpan={3}>
                 <span>Filter By Gender</span>
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
           <tr>
              <td>Number of Actors: {castCount}</td>
              <td colSpan={2}>
                 Total Cast Height: {heightTotalInCM}cm ({heightTotalInFt}ft/{heightTotalInInches}in)
              </td>
           </tr>
           
        </tbody>
        <tfoot>
            {loadingCast ? 
              (<tr><td colSpan={3}>Loading...</td></tr>)
              : null
            }
        </tfoot>
      </table>
     </>
   )
}
 