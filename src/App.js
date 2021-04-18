import React from "react";
import { Movies } from "./features/movies/Movies";
import { Cast } from "./features/cast/Cast";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Movies />
      <Cast />
    </div>
  );
}

export default App;
