import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMovies, fetchMovieCast } from './movieAPI';

const initialState = {
   list: [],
   status: 'idle',
   selectedMovie: null,
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
    },

    extraReducers: (builder) => {
       builder 
         .addCase(movieListAsync.pending, (state) => {
            state.status = 'loading_movie';
         })
         .addCase(movieListAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = action.payload;
         });
    },
 });

 export const { selectMovie } = movieSlice.actions;

 export const selectMovies = (state) => state.movies.list;
 export const moviesStatus = (state) => state.movies.status;

 export default movieSlice.reducer;