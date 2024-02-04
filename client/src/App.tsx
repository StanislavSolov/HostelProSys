import React, {useState} from 'react';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./components/Home/Home";

function App() {
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home showRegisterForm={showRegisterForm} showLoginForm={showLoginForm}
                                         setShowLoginForm={setShowLoginForm} setShowRegisterForm={setShowRegisterForm}/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
