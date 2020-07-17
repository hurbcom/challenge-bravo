import React from "react";
import ReactDOM from "react-dom";
import Conversor from "./Conversor";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Conversor />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
