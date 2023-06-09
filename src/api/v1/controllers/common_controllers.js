
const models = require('../../../config/db_config');
const notification = require('./notification_controller');
const helpers = require('../helpers/helpers');
const { QueryTypes } = require('sequelize');
const constants = require('../../../config/constants');

const CommonController = {
    send_otp: async (req, res) => {
        let { phone_no, device_id, otp_for } = req.body;
        console.log(phone_no, device_id, otp_for);

        try {
            if (device_id != "") {
                if (phone_no != "") {
                    const userCount = await models.User.count({
                        where: {
                            mobile: phone_no,
                            is_active: 1
                        }
                    });

                    let notification_title = constants.NOTIFICATION.TITLE;
                    let otp = helpers.generateSixDigitOTP();
                    let notification_body = `${constants.NOTIFICATION.MESSAGE_II} ${otp}. ${constants.NOTIFICATION.MESSAGE_I}`;
                    console.log(notification_title, notification_body);
                    
                    if (userCount > 0) {
                        console.log("inside > 0 : user count", userCount, typeof(userCount));
                        // user with the mobile number found
                        if(otp_for == "signin") {
                            const push_otp = await notification.send_notification(device_id, notification_title, notification_body);
                            console.log("Notification Response", push_otp)
                            if (push_otp.status) {
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: true,
                                    message: push_otp.message,
                                    data: [{
                                        otp: otp
                                    }]
                                });
                            } else {
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: push_otp.message,
                                    data: []
                                });
                            }
                        } else if(otp_for == "signup") {
                            console.log("inside signup otp for", userCount, typeof(userCount));
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "Phone Number already in use. Cannot register another account with same phone number.",
                                data: []
                            });
                        }
                    } else {
                        if(otp_for == "signin") {
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "User not found. Please register to create a new account.",
                                data: []
                            });
                        } else if(otp_for == "signup") {
                            console.log("else part inside signup otp for", userCount, typeof(userCount));

                            const push_otp = await notification.send_notification(device_id, notification_title, notification_body);
                            console.log("Notification Response", push_otp)
                            if (push_otp.status) {
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: true,
                                    message: push_otp.message,
                                    data: [{
                                        otp: otp
                                    }]
                                });
                            } else {
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: push_otp.message,
                                    data: []
                                });
                            }
                        }
                    }
                }
            }
        } catch (error) {
            return res.status(401).json({
                status: false,
                message: "Oops! something went wrong! Please try again.",
                data: []
            });
        }
    },
    active_categories: async (req, res) => {
        try {
            var categories = await models.Category.findAll({
                where: {
                    is_active: '1'
                },
                attributes: {
                    exclude: ['is_active', 'created_at', 'updated_at']
                }
            });

            console.log(categories);

            if (categories) {
                return res.status(200).json({
                    status: true,
                    message: "List of all active categories",
                    data: categories
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: "Categories not found!",
                    data: []
                })
            }

        } catch (error) {
            return res.status(404).json({
                status: false,
                message: "Categories not found!",
                data: []
            });
        }
    },
    get_products_by_category: async (req, res) => {
        const { category_id, slug } = req.params;
        console.log("Query param category id", category_id);
        try {
            let products = {};
            if (category_id != "" && slug != "no_slug") {
                products = await models.Product.findAll({
                    where: {
                        category_id: category_id,
                        slug: helpers.slug(slug),
                        is_active: 1
                    },
                    attributes: {
                        exclude: ['is_active', 'created_at', 'updated_at']
                    },
                    order: [
                        ['name', 'ASC'],
                        ['slug', 'ASC']
                    ]
                });
            } else if (category_id != "" && slug == "no_slug") {

                productsQuery = 'SELECT p.id, p.name, p.slug, c.id category_id, c.name category, p.image1, p.actual_price, p.sale_price, p.description, p. FROM products p JOIN categories c ON p.category_id = c.id';
                products = await models.Product.findAll({
                    where: {
                        category_id: category_id,
                        is_active: 1
                    },
                    attributes: {
                        exclude: ['is_active', 'created_at', 'updated_at']
                    },
                    order: [
                        ['name', 'ASC'],
                        ['slug', 'ASC']
                    ]
                });
            }

            if (products.length > 0) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "List of all active products.",
                    data: products
                });
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "No products under this category.",
                    data: []
                });
            }
        } catch (error) {
            console.log("ERROR geting products", error);

            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: "Something went wrong. Please try again.",
                data: []
            });
        }
    },
    top_10_products: async (req, res) => {
        try {

            let query = 'SELECT p.name, p.slug, p.image1, p.actual_price, p.sale_price, p.description, c.name category_name, c.id category_id FROM products p \
                    JOIN top_products tp ON tp.product_id = p.id \
                    JOIN categories c on c.id = p.category_id \
                    WHERE p.is_active = 1 ORDER BY p.name ASC LIMIT 10';
            console.log(query);
            const products = await models.sequelize.query(query,
                {
                    type: QueryTypes.SELECT
                });

            console.log("top products: ", products);

            if (products) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "List of top products",
                    data: products
                });
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "No Products",
                    data: []
                });
            }

        } catch (error) {
            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: error.message,
                data: []
            });
        }
    },
    getListOfOrders: async (req, res) => {
        const { user_id } = req.params;

        try {
            const selectOrdersQuery = 'SELECT o.id, o.order_name, o.order_type, o.status, o.remarks, o.is_active, o.created_at, FROM_UNIXTIME(o.created_at, \'%D %M %Y %H:%i\') AS ordered_at, p.id picklist_id, p.status picklist_status, p.remarks picklist_remarks FROM rr_mart_db.orders o JOIN picklists p on p.order_name = o.order_name WHERE o.user_id = ? ORDER BY o.created_at DESC';

            const orderData = await models.sequelize.query(
                selectOrdersQuery,
                {
                    type: QueryTypes.SELECT,
                    replacements: [user_id]
                });

            if (orderData) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Successfully retrived your orders history",
                    data: orderData
                });
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Orders not yet placed.",
                    data: []
                });
            }


        } catch (error) {
            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: "Not able to get the orders. Please try again.",
                data: []
            });
        }

    },
    get_all_products: async (req, res) => {
        try {

            let query = 'SELECT p.id, p.name, p.slug, p.image1, p.actual_price, p.sale_price, p.description, c.name category_name, c.id category_id FROM products p \
                    JOIN categories c on c.id = p.category_id \
                    WHERE p.is_active = 1 ORDER BY c.id ASC, p.name ASC';
            console.log(query);
            const products = await models.sequelize.query(query,
                {
                    type: QueryTypes.SELECT
                });

            console.log("top products: ", products);

            if (products) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "List of products",
                    data: products
                });
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "No Products",
                    data: []
                });
            }

        } catch (error) {
            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: error.message,
                data: []
            });
        }
    }
}

module.exports = CommonController;