import React, {useEffect, useState} from 'react';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./components/Home/Home";
import Search from "./components/Search/Search";
import TypeUser from "./types/TypeUser";
import AdminPanel from "./components/AdminPanel/AdminPanel";

function App() {
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<{}[] | null>(null);
  const [user, setUser] = useState<TypeUser | null>(null);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home showRegisterForm={showRegisterForm} showLoginForm={showLoginForm}
                                         setSearchData={setSearchData} user={user}
                                         setUser={setUser}
                                         setShowLoginForm={setShowLoginForm}
                                         setShowRegisterForm={setShowRegisterForm}/>}/>
          <Route path="/search/"
                 element={<Search user={user} setUser={setUser} setShowLoginForm={setShowLoginForm} setShowRegisterForm={setShowRegisterForm}
                                  showLoginForm={showLoginForm} showRegisterForm={showRegisterForm}
                                  searchData={searchData}/>}/>
          <Route path="/admin/"
                 element={<AdminPanel user={user} />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
