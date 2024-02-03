const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(PORT, '', null, () => console.log(`Server started on port ${PORT}`));