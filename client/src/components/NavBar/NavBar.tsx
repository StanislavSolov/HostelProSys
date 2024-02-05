import React, {FC} from 'react';
import './NavBar.scss';
import Logotype from '../../img/logo.svg';
import {Link} from "react-router-dom";
import TypeUser from "../../types/TypeUser";

interface NavBarProps {
  user: TypeUser | null,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
  setShowRegisterForm: React.Dispatch<React.SetStateAction<boolean>>,
  customClassName?: string,
}

const NavBar: FC<NavBarProps> = ({customClassName, user, setShowRegisterForm, setShowLoginForm}) => {
  return (
    <nav id="NavBar" className={customClassName}>
      <div className="navbar">
        <Link to="/" className="navbar__logotype">
          <img src={Logotype} alt="Logotype"/>
        </Link>
        <div className="navbar__pages">
          <Link to="/">Головна</Link>
          {
            user?.isAdmin && (
              <Link to="/admin/">Адмін панель</Link>
            )
          }
        </div>
        {
          user ? (
            <h5>Вітаю {user.login}!</h5>
          ) : (
            <div className="navbar__right">
              <button onClick={() => setShowRegisterForm(true)}>Реєстрація</button>
              <button onClick={() => setShowLoginForm(true)}>Авторизація</button>
            </div>
          )
        }
      </div>
    </nav>
  );
};

export default NavBar;