import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/movies/movieSlice";
import castReducer from "../features/cast/castSlice";

export const store = configureStore({
  reducer: {
    cast: castReducer,
    movies: moviesReducer,
  },
});
