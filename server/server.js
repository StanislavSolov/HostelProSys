const connection = require('./mysql/mysql');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userManager = require('./classes/UserManager');

const app = express();
const router = express.Router();
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  session({
    secret: 'stanislav@212',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
  })
);

const PORT = 5000;

function calculateTotalPrice(checkInDate, checkOutDate, pricePerDay) {
  const oneDay = 24 * 60 * 60 * 1000; // Одна доба у мілісекундах
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);
  const numberOfNights = Math.round(Math.abs((startDate - endDate) / oneDay));

  return numberOfNights * pricePerDay;
}

app.get('/api/v1/search', (req, res) => {
  const {city, checkInDate, checkOutDate, roomType} = req.query;

  let sql = `
    SELECT room.*, hotel.name as hotel_name, hotel.rating as hotel_rating
    FROM room
    JOIN hotel ON room.hotel_id = hotel.id
    WHERE hotel.city = ? AND room.type = ? AND room.number NOT IN (
        SELECT reservation.room_number
        FROM reservation
        WHERE (
            (reservation.check_in_date >= ? AND reservation.check_in_date <= ?) OR
            (reservation.check_out_date >= ? AND reservation.check_out_date <= ?) OR
            (? >= reservation.check_in_date AND ? <= reservation.check_out_date)
        )
    );
  `;
  let values = [city, roomType, checkInDate, checkOutDate, checkInDate, checkOutDate, checkInDate, checkOutDate];

  connection.query(sql, values, (err, result, fields) => {
    if (err) {
      console.error('Error during search:', err);
      return res.status(500).send('Internal Server Error');
    }

    let sendData = {
      ...req.query,
      result,
    }

    res.json(sendData);
  });
});

app.post('/api/v1/login', async (req, res) => {
  const {login, password} = req.body;

  try {
    const user = await userManager.login(login, password, connection);

    if (user) {
      req.session.user = {login: user.login, email: user.email, isAdmin: user.is_admin};

      res.status(200).json({email: user.email, isAdmin: user.is_admin});
    } else {
      res.status(401).send('Authentication failed');
    }
  } catch (error) {
    console.error('Error during login: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/v1/reservation', async (req, res) => {
  console.log(req.body);

  try {
    const {
      number,
      type,
      price_per_day,
      hotel_id,
      hotel_name,
      hotel_rating,
      login,
      checkInDate,
      checkOutDate
    } = req.body;

    // Отримати guest_id
    const [guestIdResult] = await connection.promise().query('SELECT `id` FROM `guest` WHERE `user_login` = ?', [login]);

    // Перевірка, чи був отриманий коректний результат
    if (guestIdResult && guestIdResult.length > 0 && guestIdResult[0].id) {
      const guestId = guestIdResult[0].id;

      const reservationSql = 'INSERT INTO `reservation` (`check_in_date`, `check_out_date`, `total_price`, `guest_id`, `room_number` ) VALUES (?, ?, ?, ?, ?);';
      const totalPrice = calculateTotalPrice(checkInDate, checkOutDate, price_per_day); // Функція для розрахунку загальної ціни
      const roomNumber = number;

      const reservationValues = [checkInDate, checkOutDate, totalPrice, guestId, roomNumber];

      await connection.promise().query(reservationSql, reservationValues);

      res.status(200);
    } else {
      res.status(404).send('Guest not found');
    }
  } catch (error) {
    console.error('Error during reservation: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/v1/register', async (req, res) => {
  const {login, email, password} = req.body;

  userManager.registerUser(login, email, password, connection);
  req.session.user = {login, email};

  res.sendStatus(200);
});

app.get('/api/v1/users', async (req, res) => {
  try {
    const sql = 'SELECT * FROM user';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching users data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error during query: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/v1/rooms', async (req, res) => {
  try {
    const sql = 'SELECT number, type, price_per_day FROM room';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching rooms data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error during query: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/v1/hotels', async (req, res) => {
  try {
    const sql = 'SELECT * FROM hotel';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching hotels data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error during query: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/v1/guests', async (req, res) => {
  try {
    const sql = 'SELECT id, full_name, phone_number FROM guest';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching guests data: ', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error('Error during query: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/v1/hotels/:id', (req, res) => {
  const hotelId = req.params.id;

  const sql = 'SELECT * FROM hotel WHERE id = ?';
  connection.query(sql, [hotelId], (err, result) => {
    if (err) {
      console.error('Error fetching hotel details: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const hotelDetails = result[0];
        res.status(200).json(hotelDetails);
      } else {
        res.status(404).send('Hotel not found');
      }
    }
  });
});

app.delete('/api/v1/hotels/:id', (req, res) => {
  const hotelId = req.params.id;

  const sql = 'DELETE FROM hotel WHERE id = ?';
  connection.query(sql, [hotelId], (err, result) => {
    if (err) {
      console.error('Error deleting hotel: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Hotel deleted successfully');
      } else {
        res.status(404).send('Hotel not found');
      }
    }
  });
});

app.get('/api/v1/guests/:id', (req, res) => {
  const guestId = req.params.id;

  const sql = 'SELECT * FROM guest WHERE id = ?';
  connection.query(sql, [guestId], (err, result) => {
    if (err) {
      console.error('Error fetching guest details: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const guestDetails = result[0];
        res.status(200).json(guestDetails);
      } else {
        res.status(404).send('Guest not found');
      }
    }
  });
});

app.delete('/api/v1/guests/:id', (req, res) => {
  const guestId = req.params.id;

  const sql = 'DELETE FROM guest WHERE id = ?';
  connection.query(sql, [guestId], (err, result) => {
    if (err) {
      console.error('Error deleting guest: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Guest deleted successfully');
      } else {
        res.status(404).send('Guest not found');
      }
    }
  });
});

app.get('/api/v1/users/:login', (req, res) => {
  const loginUser = req.params.login;

  const sql = 'SELECT * FROM user WHERE login = ?';
  connection.query(sql, [loginUser], (err, result) => {
    if (err) {
      console.error('Error fetching user details: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const userDetails = result[0];
        res.status(200).json(userDetails);
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.delete('/api/v1/users/:login', (req, res) => {
  const loginUser = req.params.login;

  const sql = 'DELETE FROM user WHERE login = ?';
  connection.query(sql, [loginUser], (err, result) => {
    if (err) {
      console.error('Error deleting hotel: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('User deleted successfully');
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});


app.get('/api/v1/rooms/:roomNumber', (req, res) => {
  const numberRoom = req.params.roomNumber;

  const sql = 'SELECT * FROM room WHERE number = ?';
  connection.query(sql, [numberRoom], (err, result) => {
    if (err) {
      console.error('Error fetching room details: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const roomDetails = result[0];
        res.status(200).json(roomDetails);
      } else {
        res.status(404).send('Room not found');
      }
    }
  });
});

app.delete('/api/v1/rooms/:roomNumber', (req, res) => {
  const numberRoom = req.params.roomNumber;

  const sql = 'DELETE FROM room WHERE number = ?';
  connection.query(sql, [numberRoom], (err, result) => {
    if (err) {
      console.error('Error deleting room: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send('Room deleted successfully');
      } else {
        res.status(404).send('Room not found');
      }
    }
  });
});

app.listen(PORT, '', null, () => console.log(`Server started on port ${PORT}`));