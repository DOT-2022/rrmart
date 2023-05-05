const express = require('express');
const router = express.Router();

const passport = require('passport');
const AuthController = require('../controllers/auth_controllers');
const CommonController = require('../controllers/common_controllers');
require('../middlewares/authentication_middleware')(passport);

router.post('/orders/create', [passport.authenticate('jwt', { session: false })], AuthController.newOrder);
router.get('/orders/:user_id', CommonController.getListOfOrders);


module.exports = router;