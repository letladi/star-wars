import React from 'react';
import { Counter } from './features/counter/Counter';
import { Movies } from './features/movies/Movies';
import './App.css';

function App() {
  return (
    <div className="App">
      <Movies />
        <Counter />
    </div>
  );
}

export default App;
