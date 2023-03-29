const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const store = new session.MemoryStore();
const logger = require('morgan');

require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const db = require('./db/index');

const registerRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const productsRouter = require('./routes/products');
const accountRouter = require('./routes/account');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const ordersRouter = require('./routes/orders');

const PORT = process.env.PORT || 4000;


app.use(cookieParser());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(logger('dev'));
app.use(cors());
app.use(helmet());

app.use(
  session({
    secret: "secret-key",
    cookie: { maxAge: 86400000, 
    httpOnly: true, secure: false, sameSite: 'none', path: "/" },
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/products', productsRouter);
app.use('/account', accountRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);



app.get('/home', (req, res) => {
    res.send('This is the home page');
})

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    console.log(results.rows)
    res.status(200).json(results.rows)
  })
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
})
