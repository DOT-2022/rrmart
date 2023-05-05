const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common_controllers');
const authController = require('../controllers/auth_controllers');

router.get('/categories/list', commonController.active_categories);
router.get('/products/list/top_products', commonController.top_10_products);
router.post('/send_otp', commonController.send_otp);
router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/products/list/:category_id/slug/:slug', commonController.get_products_by_category);
router.get('/products/list', commonController.get_all_products);


module.exports = router;