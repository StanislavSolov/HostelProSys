import React, {FC, useState} from 'react';
import './Home.scss';
import NavBar from "../NavBar/NavBar";
import HomeBackgroundPNG from './img/home-background.png';
import HomeBackground from './img/home-background.webp';
import LoginModalForm from "../LoginModalForm/LoginModalForm";
import RegisterModalForm from "../RegisterModalForm/RegisterModalForm";
import roomTypes from "../../const/roomTypes";
import axios from "axios";

interface HomeProps {
  showRegisterForm: boolean,
  showLoginForm: boolean,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
  setShowRegisterForm: React.Dispatch<React.SetStateAction<boolean>>,
}

type TypeHomeData = {
  cities: string[],
  roomTypes: string[],
}

const Home: FC<HomeProps> = ({setShowRegisterForm, showLoginForm, showRegisterForm, setShowLoginForm}) => {
  const [homeData, setHomeData] = useState<TypeHomeData>({
    cities: [
      'Київ',
      'Харків',
      'Дніпро',
      'Кременчук',
    ],
    roomTypes: roomTypes,
  });


  const onSubmitSearchForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchParams = new URLSearchParams(formData as any).toString();

    try {
      const response = await axios.get(`http://localhost:5000/api/v1/search?${searchParams}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error during search: ', error);
    }
  };


  return (
    <header id="Home">
      {
        showLoginForm &&  <LoginModalForm setShowLoginModalForm={setShowLoginForm} showLoginModalForm={showLoginForm} />
      }
      {
        showRegisterForm && <RegisterModalForm setShowRegisterModalForm={setShowRegisterForm} showRegisterModalForm={showRegisterForm} />
      }
      <div className="home">
        <NavBar setShowLoginForm={setShowLoginForm}
                setShowRegisterForm={setShowRegisterForm}/>
        <div className="home__info">
          <h1>Залишайтеся з нами, почувайтеся <br/>як <strong>вдома</strong>.</h1>
          <h4>Готелі, де дозволено проживання з домашніми тваринами, стають все більш популярними; привабливий для мандрівників, які не можуть винести розлуки.</h4>
          <button>Забронювати</button>
        </div>
        <form onSubmit={onSubmitSearchForm} method="GET">
          <select name="city">
            {
              homeData.cities.map((element: string, index: number) => (
                <option key={index} value={element}>{element}</option>
              ))
            }
          </select>
          <input name="checkInDate" required type="date"/>
          <input name="checkOutDate" required type="date"/>
          <select name="roomType">
            {
              homeData.roomTypes.map((element: string, index: number) => (
                <option key={index} value={element}>{element}</option>
              ))
            }
          </select>
          <button type="submit">Пошук</button>
        </form>
      </div>
      <picture className="home-background">
        <source type="image/webp" srcSet={HomeBackground}/>
        <img draggable={false} src={HomeBackgroundPNG} alt="background"/>
      </picture>
    </header>
  );
};

export default Home;