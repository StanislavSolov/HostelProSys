import React, {FC} from 'react';
import './HotelCard.scss';
import {Link} from "react-router-dom";

interface HotelCardProps {
  keyCard: number,
  number: number,
  type: string,
  price_per_day: number,
  hotel_id: number,
  hotel_name: string,
  hotel_rating: string,
  onClickBookRoom: (roomIndex: number) => any,
}

const HotelCard: FC<HotelCardProps> = ({keyCard, onClickBookRoom, type, hotel_name, hotel_rating, hotel_id, price_per_day, number}) => {
  return (
    <article className="hotel-card" key={keyCard}>
      <div className="hotel-card__info">
        <div className="hotel-card__title">
          <h4>{type}</h4>
          <h6>{price_per_day}UAH за ніч</h6>
        </div>
        <button onClick={() => onClickBookRoom(keyCard)}>Забронювати</button>
      </div>
      <Link to={`/hotel/${hotel_id}/room/${number}`} className="hotel-card__more">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="#081F32" xmlns="http://www.w3.org/2000/svg">
          <g id="Complete">
            <g id="F-More">
              <path
                d="M8,12a2,2,0,1,1-2-2A2,2,0,0,1,8,12Zm10-2a2,2,0,1,0,2,2A2,2,0,0,0,18,10Zm-6,0a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"
                id="Horizontal"/>
            </g>
          </g>
        </svg>
      </Link>
    </article>
  );
};

export default HotelCard;