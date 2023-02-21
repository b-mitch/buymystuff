const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const ordersRouter = express.Router();

ordersRouter.use(bodyParser.json());
ordersRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



module.exports = ordersRouter;