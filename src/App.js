import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Screen0 from "./components/Screen0";
import Screen1 from "./components/Screen1";
import Screen2 from "./components/Screen2";
import Keys from "./components/Keys";

const App = () => {
  
  return (
    <div className="App">
      <Router>
          <div>
            <Routes>
              <Route exact path="/" element={<Screen0/>} />
              <Route exact path="/keys" element={<Keys/>} />
              <Route exact path="/screen1" element={<Screen1/>} />
              <Route exact path="/screen2" element={<Screen2/>}/>
            </Routes>
          </div>
        </Router>
    </div>
  );
};

export default App;