const express = require('express');
const router = express.Router();

const passport = require('passport');
const AuthController = require('../controllers/auth_controllers');
const CommonController = require('../controllers/common_controllers');
require('../middlewares/authentication_middleware')(passport);

router.get('/:user_id', [passport.authenticate('jwt', { session: false })], AuthController.getUserData);

router.get('/orders/:user_id', CommonController.getListOfOrders);
router.post('/orders/create', [passport.authenticate('jwt', { session: false })], AuthController.newOrder);

router.get('/address/:user_id', [passport.authenticate('jwt', { session: false })], AuthController.getAllAddress);
router.post('/address/change', [passport.authenticate('jwt', { session: false })], AuthController.changeDeliveryAddress);
router.post('/address/update', [passport.authenticate('jwt', { session: false })], AuthController.updateDeliveryAddress);
router.post('/address/add', [passport.authenticate('jwt', { session: false })], AuthController.addNewAddress);
router.get('/:user_id/address/:address_id/delete', [passport.authenticate('jwt', { session: false })], AuthController.deleteAddress);


module.exports = router;

