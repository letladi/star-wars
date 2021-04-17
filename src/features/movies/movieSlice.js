import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { round } from 'lodash'
import { fetchMovies, fetchMovieCast } from './movieAPI';

const initialState = {
   list: [],
   cast: [],
   status: 'not_loaded',
   selectedMovie: null,
   castStatus: false,
   castSortSettings: {
      by: 'name',
      asc: true,
   },
   castFilterSettings: {
      by: 'gender',
      val: 'all',
   },
};

export const sortBy = (cast, prop, asc, type) => {
   return cast.sort((a1, a2) => {
      if (type === 'number') {
         const num1 = isNaN(a1[prop]) ? 0 : Number(a1[prop]);
         const num2 = isNaN(a2[prop]) ? 0 : Number(a2[prop]);
         return asc ? (num1 - num2) : (num2 - num1);
      }

      if (asc) {
         if (a1[prop] > a2[prop]) return 1;
         else if (a1[prop] < a2[prop]) return -1;
         else return 0;
      } else {
         if (a1[prop] < a2[prop]) return 1;
         else if (a1[prop] > a2[prop]) return -1;
         else return 0;
      }
   });
};

export const movieListAsync = createAsyncThunk(
   'movies/fetchMovies',
   async () => {
     return await fetchMovies();
   }
 );

 export const fetchCast = createAsyncThunk(
   'movies/fetchMovieCast',
   async (movie) => {
      return await fetchMovieCast(movie);
   }
 );

 export const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
       selectMovie: (state, action) => {
          state.selectedMovie = action.payload;
       },
       sortCast: (state, action) => {
          if (state.castSortSettings.by === action.payload) {
            state.castSortSettings.asc = !state.castSortSettings.asc;
          } else {
            state.castSortSettings = {
               by: action.payload,
               asc: true,
            };
          }
       },
       filterCast: (state, action) => {
         state.castFilterSettings = action.payload;
       },
    },

    extraReducers: (builder) => {
       builder 
         .addCase(movieListAsync.pending, (state) => {
            state.status = 'loading_movie';
         })
         .addCase(movieListAsync.fulfilled, (state, action) => {
            state.status = 'loaded';
            state.list = action.payload;
         })
         .addCase(fetchCast.pending, (state) => {
            state.loading_cast = true;
         })
         .addCase(fetchCast.fulfilled, (state, action) => {
            state.loading_cast = false;
            state.cast.push(action.payload);
         });
    },
 });

 export const { selectMovie, sortCast, filterCast } = movieSlice.actions;

 export const selectMovies = (state) => state.movies.list;
 export const moviesStatus = (state) => state.movies.status;
 export const activeMovieSelector = (state) => state.movies.selectedMovie;

 const getFilteredCast = (state) => {
   const filter = state.movies.castFilterSettings;
   return state.movies.cast.filter(actor => {
      if (filter.val === 'all') return true;
      else if (filter.by === 'gender') return actor.gender === filter.val;
      else return false;
   });
 }
 export const selectCast = (state) => {
   
   const sortSettings = state.movies.castSortSettings;

   return sortBy(
      getFilteredCast(state), 
      sortSettings.by,
      sortSettings.asc,
      sortSettings.by === 'height' ? 'number' : 'string'
   );
};

 export const castStatus = (state) => state.movies.loading_cast;
 export const selectCastSortSettings = (state) => state.movies.castSortSettings;

export const castCountSelector = (state) => getFilteredCast(state).length;

export const heightTotalSelector = (state) => {
   if (!state.movies.cast.length) return [0, 0, 0];
   const totalInCMs = getFilteredCast(state).reduce((totalHeight, { height }) => {
      return isNaN(height) ? 
         totalHeight : (totalHeight + Number(height));
   }, 0);

   const centimeterInInches = 2.54;
   const centimeterInFeet = 30.48;
   const totalInInches = totalInCMs / centimeterInInches;
   const totalInFt = totalInCMs / centimeterInFeet;
   return [round(totalInCMs, 2), round(totalInInches, 2), round(totalInFt, 2)];
}

 export default movieSlice.reducer;