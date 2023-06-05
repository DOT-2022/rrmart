const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/admin_controllers');
const passport = require('passport');
require('../middlewares/authentication_middleware')(passport);
const fileStorage = require('../middlewares/file_upload_middleware');

let upload = multer({ storage: fileStorage });

// var multipleFiles = upload.fields([
//     {
//         name: 'image1',
//         maxCount: 1
//     },
//     {
//         name: 'image2',
//         maxCount: 1
//     },
//     {
//         name: 'image3',
//         maxCount: 1
//     },
//     {
//         name: 'image4',
//         maxCount: 1
//     }
// ]);

// Routes for Categories
router.post('/categories/create', [passport.authenticate('jwt', { session: false }), upload.single("image")], adminController.createNewCategory);
router.get('/categories/list', [passport.authenticate('jwt', { session: false })], adminController.getAllCategories);
router.post('/categories/update', [passport.authenticate('jwt', { session: false })], adminController.updateCategory);
router.post('/categories/update/image', [passport.authenticate('jwt', { session: false }), upload.single("image")], adminController.updateCategoryImage);

// Routes for Products
router.post('/products/create', [passport.authenticate('jwt', { session: false }), upload.single("image")], adminController.createNewProduct);
router.get('/products/list', [passport.authenticate('jwt', { session: false })], adminController.getAllProudcts);
router.post('/products/update', [passport.authenticate('jwt', { session: false })], adminController.updateProduct);
router.post('/products/update/image', [passport.authenticate('jwt', { session: false }), upload.single("image")], adminController.updateProductImage);

// Routes for Orders
router.get('/orders/active_orders', [passport.authenticate('jwt', { session: false })], adminController.getAllLatestOrders);
router.get('/orders/active_orders/:order_id/:tab', [passport.authenticate('jwt', { session: false })], adminController.showParticularOrderDetails);

router.post('/orders/active_orders/change_status', [passport.authenticate('jwt', { session: false })], adminController.changeOrderStatus);
// Routes for Store
router.get('/store/all', [passport.authenticate('jwt', { session: false })], adminController.getStoreDetails);
router.get('/users/list', [passport.authenticate('jwt', { session: false })], adminController.getUsersDetails);

module.exports = router;