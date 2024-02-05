import React, {FC, useState} from 'react';
import './Search.scss';
import NavBar from "../NavBar/NavBar";
import LoginModalForm from "../LoginModalForm/LoginModalForm";
import RegisterModalForm from "../RegisterModalForm/RegisterModalForm";
import HotelCard from "./HotelCard/HotelCard";
import axios from "axios";
import TypeUser from "../../types/TypeUser";

interface SearchProps {
  showRegisterForm: boolean,
  showLoginForm: boolean,
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>,
  setShowRegisterForm: React.Dispatch<React.SetStateAction<boolean>>,
  searchData: any,
  user: TypeUser | null,
  setUser: React.Dispatch<React.SetStateAction<TypeUser | null>>,
}

const Search: FC<SearchProps> = ({
                                   searchData,
                                   setShowLoginForm,
                                   showRegisterForm,
                                   showLoginForm,
                                   setUser,
                                   setShowRegisterForm, user
                                 }) => {
  const onClickBookRoom = async (roomIndex: number) => {
    if (!searchData) return;
    if (!user) {
      setShowRegisterForm(true);
      return;
    }

    const room = searchData.rooms[roomIndex];
    const sendData = {
      ...room,
      login: user.login,
      checkInDate: searchData.checkInDate,
      checkOutDate: searchData.checkOutDate,
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/reservation', sendData);

      if (response.status === 200) alert('Успіх!');

    } catch (e) {
      console.error('Error booking room in the hotel: ' + e);
    }
  }

  return (
    <header id="Search">
      {
        showLoginForm &&
        <LoginModalForm setUser={setUser} setShowLoginModalForm={setShowLoginForm} showLoginModalForm={showLoginForm}/>
      }
      {
        showRegisterForm &&
        <RegisterModalForm setUser={setUser} setShowRegisterModalForm={setShowRegisterForm}
                           showRegisterModalForm={showRegisterForm}/>
      }
      <div className="search">
        <NavBar user={user} setShowRegisterForm={setShowRegisterForm} setShowLoginForm={setShowLoginForm}/>
        <div className="search-result">
          {
            searchData && searchData.rooms.length > 0 ? (
              searchData.rooms.map(({
                                number,
                                hotel_id,
                                hotel_name,
                                price_per_day,
                                type,
                                hotel_rating
                              }: Record<string, any>, index: number) => (
                <HotelCard key={index} onClickBookRoom={onClickBookRoom} keyCard={index} {...{
                  number,
                  hotel_id,
                  price_per_day,
                  hotel_name,
                  type,
                  hotel_rating
                }}/>
              ))
            ) : (
              <h1>Ваш пошуковий запит не дав результатів</h1>
            )
          }
        </div>
      </div>
    </header>
  );
};

export default Search;