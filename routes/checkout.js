const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const checkoutRouter = express.Router();

checkoutRouter.use(bodyParser.json());
checkoutRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



module.exports = checkoutRouter;