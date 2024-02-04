const connection = require('./mysql/mysql');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userManager = require('./classes/UserManager');

const app = express();
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

app.get('/api/v1/search', (req, res) => {
  const { city, checkInDate, checkOutDate, roomType } = req.query;

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

    res.json(result);
  });
});

app.post('/api/v1/login', async (req, res) => {
  const {login, password} = req.body;

  try {
    const user = await userManager.login(login, password, connection);

    if (user) {
      req.session.user = {login: user.login, email: user.email, isAdmin: user.isAdmin};

      res.status(200).json({email: user.email, isAdmin: user.isAdmin});
    } else {
      res.status(401).send('Authentication failed');
    }
  } catch (error) {
    console.error('Error during login: ', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/v1/register', async (req, res) => {
  const {login, email, password} = req.body;

  userManager.registerUser(login, email, password, connection);
  req.session.user = {login, email};

  res.sendStatus(200);
});

app.listen(PORT, '', null, () => console.log(`Server started on port ${PORT}`));