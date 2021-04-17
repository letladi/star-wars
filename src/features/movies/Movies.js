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
         <option value="-1">Please Choose A Movie Title</option>
         {movies.map((movie, index) => (
            <option value={index} key={index}>{movie.title}</option>))}
       </select>
      {/* <div className={styles.marquee}>
         <p className={styles.marqueeParagraph}>
         <span className={styles.marqueeSpan}>
            {selectedMovie && selectedMovie.opening_crawl}
         </span>
         </p>
      </div> */}

      <div className={styles.marquee}>
         <div className={styles.marqueeDiv}>
            <span className={styles.marqueeSpan}>
               {selectedMovie && selectedMovie.opening_crawl}
            </span>
            {/* <span className={styles.marqueeSpan}>You spin me right round, baby. Like a record, baby.</span> */}
         </div>
      </div>

      {/* <p 
         
         style={{ width: '100%', 'white-space': 'nowrap'}}
      ></p> */}

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
            <TRow>
               <TCol></TCol>
               <TCol></TCol>
               <TCol>
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
               </TCol>
               
            </TRow>
           <TRow>
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
           </TRow>
         </thead>
         <tbody>
           {cast.map((actor, index) => (
              <TRow key={index}>
                 <TCol>{actor.name}</TCol>
                 <TCol>{actor.gender === 'male' ? '♂' : (actor.gender === 'female' ? '♀' : '-') }</TCol>
                 <TCol>{isNaN(actor.height) ? '-' : actor.height}</TCol>
              </TRow>
           ))}
           <TRow>
              <TCol>Number of Actors: {castCount}</TCol>
              <TCol>
                 Total Cast Height: {heightTotalInCM}cm ({heightTotalInFt}ft/{heightTotalInInches}in)
              </TCol>
           </TRow>
           {loadingCast ? 
              (<TRow><TCol>Loading...</TCol></TRow>)
              : null
           }
        </tbody>
      </table>
     </>
   )
}

function TCol(props) {
   return <td className={'td'}>{props.children}</td>
}

function TRow(props) {
   return <tr className={'tr'}>{props.children}</tr>
}
 