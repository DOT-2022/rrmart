const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controllers');
const passport = require('passport');
require('../middlewares/authentication_middleware')(passport);


router.post('/categories/create', passport.authenticate('jwt', { session: false }), adminController.createNewCategory);

module.exports = router;