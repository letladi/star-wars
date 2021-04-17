import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMovies } from './movieAPI';

const initialState = {
   list: [],
   status: 'not_loaded',
   selectedMovie: null,
};

export const movieListAsync = createAsyncThunk(
   'movies/fetchMovies',
   async () => {
     try {
         const ret = await fetchMovies();
         return ret;
      } catch(e) {
         return { err: "Could not fetch movie list" };
      }
   }
 );

 export const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
       selectMovie: (state, action) => {
          state.selectedMovie = action.payload;
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
         });
    },
 });

export const { selectMovie } = movieSlice.actions;

export const selectMovies = (state) => state.movies.list;
export const moviesStatus = (state) => state.movies.status;
export const activeMovieSelector = (state) => state.movies.selectedMovie;

export default movieSlice.reducer;