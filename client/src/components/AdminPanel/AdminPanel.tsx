import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.scss';
import TypeUser from "../../types/TypeUser";
import {useNavigate} from "react-router";

interface AdminPanelProps {
  user: TypeUser | null,
}

const AdminPanel: FC<AdminPanelProps> = ({user}) => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [guests, setGuests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchRoomData();
    fetchHotelData();
    fetchGuestData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const fetchRoomData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching room data: ', error);
    }
  };

  const fetchHotelData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotel data: ', error);
    }
  };

  const fetchGuestData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/guests');
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guest data: ', error);
    }
  };

  const handleDeleteUser = async (login: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${login}`);
      fetchUserData();
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/hotels/${hotelId}`);
      fetchHotelData();
    } catch (error) {
      console.error('Error deleting hotel: ', error);
    }
  };

  const handleDeleteGuest = async (guestId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/guests/${guestId}`);
      fetchGuestData();
    } catch (error) {
      console.error('Error deleting guest: ', error);
    }
  };

  const handleDeleteRoom = async (roomNumber: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/rooms/${roomNumber}`);
      fetchRoomData();
    } catch (error) {
      console.error('Error deleting room: ', error);
    }
  };

  if (!user?.isAdmin) {
    navigate('/');
  }

  return (
    <header id="AdminPanel">
      <h2>Користувачі</h2>
      <table>
        <thead>
        <tr>
          <th>Login</th>
          <th>Email</th>
          <th>isAdmin</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user: any, index: number) => (
          <tr key={index}>
            <td>{user.login}</td>
            <td>{user.email}</td>
            <td>{user.is_admin ? 'Так' : 'Ні'}</td>
            <td>
              <button onClick={() => handleDeleteUser(user.login)}>Видалити</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <h2>Готелі</h2>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Назва</th>
          <th>Рейтинг</th>
          <th>Місто</th>
        </tr>
        </thead>
        <tbody>
        {hotels.map((hotel: any, index: number) => (
          <tr key={index}>
            <td>{hotel.id}</td>
            <td>{hotel.name}</td>
            <td>{hotel.rating}</td>
            <td>{hotel.city}</td>
            <td>
              <button onClick={() => handleDeleteHotel(hotel.id)}>Видалити</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <h2>Відвідувачі</h2>
      <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>ПІБ</th>
          <th>Номер телефону</th>
        </tr>
        </thead>
        <tbody>
        {guests.map((guest: any, index: number) => (
          <tr key={index}>
            <td>{guest.id}</td>
            <td>{guest.full_name}</td>
            <td>{guest.phone_number}</td>
            <td>
              <button onClick={() => handleDeleteGuest(guest.id)}>Видалити</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <h2>Кімнати</h2>
      <table>
        <thead>
        <tr>
          <th>Номер</th>
          <th>Тип</th>
          <th>Ціна за ніч</th>
        </tr>
        </thead>
        <tbody>
        {rooms.map((room: any, index: number) => (
          <tr key={index}>
            <td>{room.number}</td>
            <td>{room.type}</td>
            <td>{room.price_per_day}</td>
            <td>
              <button onClick={() => handleDeleteRoom(room.number)}>Видалити</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </header>
  );
};

export default AdminPanel;
