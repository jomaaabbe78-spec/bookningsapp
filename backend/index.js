require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',      require('./src/routes/auth'));
app.use('/api/companies', require('./src/routes/companies'));
app.use('/api/services',  require('./src/routes/services'));
app.use('/api/bookings',  require('./src/routes/bookings'));
app.use('/api/payments',  require('./src/routes/payments'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server kör på port ${PORT}`));
