const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const cartRouter = express.Router();

cartRouter.use(bodyParser.json());
cartRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



module.exports = cartRouter;