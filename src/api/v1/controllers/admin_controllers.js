
const models = require('../../../config/db_config');
const helpers = require('../helpers/helpers');
const { QueryTypes } = require('sequelize');
const notification = require('./notification_controller');
const constants = require('../../../config/constants');
const fs = require('fs');

const AdminController = {
    getUsersDetails: async (req, res) => {
        try {

            let applicationUser = {
                allUsers: [],
                usersByOrder: []
            }

            users = await models.User.findAll({
                where: {
                    role: 'User',
                    is_active: 1
                },
            });

            new_order_query = `SELECT u.first_name, u.last_name, u.mobile, JSON_ARRAYAGG(o.order_name) as orders
                                FROM users u JOIN
                                    orders o
                                    ON u.id = o.user_id
                                WHERE o.is_active = 1
                                AND u.role = 'User'
                                AND o.status = 'Received'
                                GROUP BY u.id`;


            const newOrders = await models.sequelize.query(
                new_order_query,
                {
                    type: QueryTypes.SELECT
                });

            applicationUser.allUsers = users;
            applicationUser.usersByOrder = newOrders

            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: true,
                message: "List of users",
                data: applicationUser
            });

        } catch (error) {
            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: error.message,
                data: []
            });
        }
    },
    createNewCategory: async (req, res) => {
        try {
            const { name, slug } = req.body;
            const image = req.file;

            let checkedCategory = await models.Category.findAndCountAll({
                where: {
                    name: helpers.titleCase(name)
                }
            });

            if (checkedCategory.count == 0) {
                const categories = await models.Category.create({
                    name: helpers.titleCase(name),
                    slug: helpers.slug(slug),
                    image: image.filename,
                    is_active: '1',
                    created_at: helpers.currentTime(),
                    updated_at: helpers.currentTime(),
                });

                console.log(categories);

                if (categories) {
                    const allCategories = await getExisitngActivecategories();

                    console.log(allCategories);

                    return res.status(200).json({
                        status: true,
                        message: `New Category: ${helpers.titleCase(name)} created successfully!`,
                        data: allCategories
                    });
                }
            }
            console.log("checkCategory", checkedCategory);
            return res.status(404).json({
                status: false,
                message: `Category ${helpers.titleCase(name)} already exists!`,
                data: []
            });
        } catch (error) {
            console.log("Error", error);
            return res.status(404).json({
                status: false,
                message: "Unable to create new category. Please try again!",
                data: []
            });
        }
    },
    getAllCategories: async (req, res) => {
        try {
            let allActiveCategory = await getExisitngActivecategories();
            if (allActiveCategory) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "List of all active categories",
                    data: allActiveCategory
                });
            } else {
                console.log(allActiveCategory);
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "No active categories",
                    data: []
                });
            }

        } catch (error) {
            return res.status(404).json({
                status: false,
                message: error.message,
                data: []
            });
        }

    },
    updateCategory: async (req, res) => {
        const { id, name, slug, is_active } = req.body;

        console.log("Request Received", id, name, slug, is_active);

        try {
            let existingCategory = await models.Category.findByPk(id);

            if (existingCategory) {

                let updateResp = await models.Category.update({
                    name: helpers.titleCase(name),
                    slug: helpers.slug(slug),
                    is_active: is_active,
                    updated_at: helpers.currentTime(),
                }, {
                    where: {
                        id: id
                    }
                });

                console.log("updated data", updateResp);

                let allActiveCategory = await getExisitngActivecategories();

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Updated Successfully",
                    data: allActiveCategory
                });

            } else {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: "Update failed. No such category exists.",
                    data: []
                });
            }
        } catch (error) {
            return res.status(404).json({
                status: false,
                message: `Couldn't find active category`,
                data: []
            });
        }

    },
    updateCategoryImage: async (req, res) => {
        const { id } = req.body;
        const image = req.file;

        try {
            let existingCategory = await models.Category.findByPk(id);

            if (existingCategory) {

                await removeImage('remove_old_file', id, "category");

                let updateResp = await models.Category.update({
                    image: image.filename,
                    updated_at: helpers.currentTime(),
                }, {
                    where: {
                        id: id
                    }
                });

                console.log("updated data", updateResp);

                let allActiveCategory = await getExisitngActivecategories();

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Image Updated Successfully",
                    data: allActiveCategory
                });

            } else {
                await removeImage('remove_new_file', id, "");
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "Update failed. No such category exists.",
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
    createNewProduct: async (req, res) => {
        try {
            const { name, slug, category_id, description, actual_price, sale_price } = req.body;
            const image = req.file;

            let checkedProduct = await models.Product.findAndCountAll({
                where: {
                    category_id: category_id,
                    name: helpers.titleCase(name)
                }
            });

            if (checkedProduct.count == 0) {
                const prducts = await models.Product.create({
                    name: helpers.titleCase(name),
                    slug: helpers.slug(slug),
                    category_id: category_id,
                    image1: image.filename,
                    description: description,
                    actual_price: actual_price,
                    sale_price: sale_price,
                    is_active: '1',
                    created_at: helpers.currentTime(),
                    updated_at: helpers.currentTime(),
                });

                console.log(prducts);

                if (prducts) {
                    const allprducts = await getExisitngActiveProducts();

                    console.log(allprducts);

                    return res.status(200).json({
                        status: true,
                        message: `New Product: ${helpers.titleCase(name)} is created successfully!`,
                        data: allprducts
                    });
                }
            }
            console.log("checkedProduct", checkedProduct);
            return res.status(404).json({
                status: false,
                message: `Poduct ${helpers.titleCase(name)} already exists!`,
                data: []
            });
        } catch (error) {
            console.log("Error", error);
            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: error.message,
                data: error
            });
        }
    },
    getAllProudcts: async (req, res) => {
        try {

            let allActiveProudct = await getExisitngActiveProducts();

            if (allActiveProudct) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "List of all active Products",
                    data: allActiveProudct
                });
            } else {
                console.log(allActiveProudct);
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "No active Products",
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
    updateProductImage: async (req, res) => {
        const { id } = req.body;
        const image = req.file;

        console.log("filename", global.fileUploadeWithName);

        try {
            let existingProduct = await models.Product.findByPk(id);

            if (existingProduct) {
                console.log("product", existingProduct);
                // After Updating the image name in the db, we need to delete the old
                // image from the storage.
                await removeImage('remove_old_file', id, "products");

                // Updating the product details without changing the category
                let updateResp = await models.Product.update({
                    image1: image.filename,
                    updated_at: helpers.currentTime(),
                }, {
                    where: {
                        id: id
                    }
                });


                console.log("updated data", updateResp);

                let allActiveProducts = await getExisitngActiveProducts();

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Product image updated successfully!",
                    data: allActiveProducts
                });

            } else {
                // After Updating the image name in the db, we need to delete the old
                // image from the storage.
                await removeImage('remove_new_file', 0, "");
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "Update failed. No such product exists.",
                    data: []
                });
            }
        } catch (error) {
            // After Updating the image name in the db, we need to delete the old
            // image from the storage.
            console.log(error.message);
            await removeImage('remove_new_file', 0, "");
            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: error.message,
                data: []
            });
        }

    },
    updateProduct: async (req, res) => {
        const { id, name, slug, category_id, description, actual_price, sale_price, is_active } = req.body;

        console.log('Update Product', id, name, slug, category_id, description, actual_price, sale_price, is_active);
        try {
            let existingProduct = await models.Product.findByPk(id);

            if (existingProduct) {
                console.log("product", existingProduct);
                if (existingProduct.category_id == category_id) {
                    console.log("category_id", category_id, typeof (category_id), 'exusting category_id', existingProduct.category_id, typeof (existingProduct.category_id));

                    // Updating the product details without changing the category
                    let updateResp = await models.Product.update({
                        name: helpers.titleCase(name),
                        slug: helpers.slug(slug),
                        category_id: category_id,
                        description: description,
                        actual_price: actual_price,
                        sale_price: sale_price,
                        is_active: is_active,
                        updated_at: helpers.currentTime(),
                    }, {
                        where: {
                            id: id
                        }
                    });


                    console.log("updated data", updateResp);

                    let allActiveProducts = await getExisitngActiveProducts();

                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                        status: true,
                        message: "Updated Successfully",
                        data: allActiveProducts
                    });
                } else {
                    // Updating the product details by changing the category
                    const duplicateCount = await getExisitngParticularProduct(category_id, name);

                    console.log("Duplicate count:", duplicateCount);
                    if (duplicateCount.count == 0) {

                        let updateResp = await models.Product.update({
                            name: helpers.titleCase(name),
                            slug: helpers.slug(slug),
                            category_id: category_id,
                            description: description,
                            actual_price: actual_price,
                            sale_price: sale_price,
                            is_active: is_active,
                            updated_at: helpers.currentTime(),
                        }, {
                            where: {
                                id: id
                            }
                        });

                        console.log("updated data", updateResp);


                        let allActiveProducts = await getExisitngActiveProducts();

                        return res.status(constants.STATUS_CODE.SUCCESS).json({
                            status: true,
                            message: "Updated Successfully",
                            data: allActiveProducts
                        });
                    } else {
                        return res.status(constants.STATUS_CODE.FAIL).json({
                            status: false,
                            message: "Product under this category already exists.",
                            data: []
                        });
                    }
                }

            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "Update failed. No such product exists.",
                    data: []
                });
            }
        } catch (error) {
            // After Updating the image name in the db, we need to delete the old
            // image from the storage.
            console.log(error.message);
            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: error.message,
                data: []
            });
        }

    },
    getAllLatestOrders: async (req, res) => {
        // This API will return all the latest orders from the customers order by newest order last
        // We check the Status field as Received and is_active as true.
        const oldestOrderQuery = `SELECT 
                                u.first_name, 
                                u.last_name, 
                                u.mobile, 
                                o.id order_id,
                                o.order_name, 
                                o.order_type,  
                                o.status,
                                o.remarks,
                                o.created_at
                            FROM users u
                            LEFT JOIN orders o ON o.user_id = u.id
                            WHERE o.status = 'Received'
                            AND o.is_active = 1 
                            ORDER BY o.created_at ASC`;
        try {
            const orders = await models.sequelize.query(
                oldestOrderQuery,
                {
                    type: QueryTypes.SELECT
                });

            if (orders) {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: `List of all the orders sorted as First Order In First Order Out order.`,
                    data: orders
                });
            } else {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: `No active orders.`,
                    data: []
                });
            }
        } catch (error) {
            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: error.message,
                data: []
            });
        }
    },
    showParticularOrderDetails: async (req, res) => {
        try {
            const order_id = req.params.order_id;
            const tabName = req.params.tab;

            console.log("ORDER ID: " + order_id, tabName);

            let response_data = {
                order_id: order_id,
                order_type: "",
                order_status: "",
                order_remarks: "",
                ordered_by: {
                    name: "",
                    mobile: "",
                    address: "",
                    landmark: "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: ""
                },
                delivery_add: {
                    name: "",
                    contact: "",
                    address: "",
                    landmark: "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: ""
                },
                picklist: []
            };

            let oldestOrderQuery = "";

            switch (tabName) {
                case "active":
                    oldestOrderQuery = "SELECT \
                            u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                            ua.first_name d_first_name, ua.last_name d_last_name, ua.contact d_mobile, ua.address d_address, ua.landmark d_landmark, ua.city d_city, ua.state d_state, ua.country d_country, ua.pincode d_pincode, \
                            o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                            FROM users u \
                            JOIN orders o ON o.user_id = u.id \
                            JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1\
                            WHERE o.status = 'Confirmed' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.created_at ASC";
                    break;

                case "rejected":
                    oldestOrderQuery = "SELECT \
                            u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                            ua.first_name d_first_name, ua.last_name d_last_name, ua.contact d_mobile, ua.address d_address, ua.landmark d_landmark, ua.city d_city, ua.state d_state, ua.country d_country, ua.pincode d_pincode, \
                            o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                            FROM users u \
                            JOIN orders o ON o.user_id = u.id \
                            JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1\
                            WHERE o.status = 'Rejected' \
                            AND o.is_active = 0 \
                            AND o.id = ? \
                            ORDER BY o.updated_at DESC";
                    break;

                case "picking":
                    oldestOrderQuery = "SELECT \
                            u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                            ua.first_name d_first_name, ua.last_name d_last_name, ua.contact d_mobile, ua.address d_address, ua.landmark d_landmark, ua.city d_city, ua.state d_state, ua.country d_country, ua.pincode d_pincode, \
                            o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                            FROM users u \
                            JOIN orders o ON o.user_id = u.id \
                            JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1\
                            WHERE o.status = 'Picking Items' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.created_at ASC";
                    break;

                case "completed":
                    oldestOrderQuery = "SELECT \
                            u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                            ua.first_name d_first_name, ua.last_name d_last_name, ua.contact d_mobile, ua.address d_address, ua.landmark d_landmark, ua.city d_city, ua.state d_state, ua.country d_country, ua.pincode d_pincode, \
                            o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                            FROM users u \
                            JOIN orders o ON o.user_id = u.id \
                            JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1\
                            WHERE o.status = 'Picking Completed' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.created_at ASC";
                    break;

                case "delivered":
                    oldestOrderQuery = "SELECT \
                            u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                            ua.first_name d_first_name, ua.last_name d_last_name, ua.contact d_mobile, ua.address d_address, ua.landmark d_landmark, ua.city d_city, ua.state d_state, ua.country d_country, ua.pincode d_pincode, \
                            o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                            FROM users u \
                            JOIN orders o ON o.user_id = u.id \
                            JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1\
                            WHERE o.status = 'Order Delivered' \
                            AND o.is_active = 0 \
                            AND o.id = ? \
                            ORDER BY o.created_at ASC";
                    break;

                default:
                    //new
                    oldestOrderQuery = "SELECT \
                            u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                            ua.first_name d_first_name, ua.last_name d_last_name, ua.contact d_mobile, ua.address d_address, ua.landmark d_landmark, ua.city d_city, ua.state d_state, ua.country d_country, ua.pincode d_pincode, \
                            o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                            FROM users u \
                            JOIN orders o ON o.user_id = u.id \
                            JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1\
                            WHERE o.status = 'Received' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.created_at ASC";
                    break;
            }

            const orders = await models.sequelize.query(
                oldestOrderQuery,
                {
                    replacements: [order_id],
                    type: QueryTypes.SELECT
                });

            if (orders) {
                console.log("ORDERS", orders[0]);
                response_data.order_id = orders[0].order_id;
                response_data.order_type = orders[0].order_type;
                response_data.order_status = orders[0].status;
                response_data.order_remarks = orders[0].remarks;
                response_data.ordered_by.name = helpers.joinFirstAndLastName(orders[0].first_name, orders[0].last_name);
                response_data.ordered_by.mobile = orders[0].mobile;
                response_data.ordered_by.address = orders[0].address;
                response_data.ordered_by.landmark = orders[0].landmark;
                response_data.ordered_by.city = orders[0].city;
                response_data.ordered_by.state = orders[0].state;
                response_data.ordered_by.country = orders[0].country;
                response_data.ordered_by.pincode = orders[0].pincode;
                response_data.delivery_add.name = helpers.joinFirstAndLastName(orders[0].d_first_name, orders[0].d_last_name);
                response_data.delivery_add.mobile = orders[0].d_mobile;
                response_data.delivery_add.address = orders[0].d_address;
                response_data.delivery_add.landmark = orders[0].d_landmark;
                response_data.delivery_add.city = orders[0].d_city;
                response_data.delivery_add.state = orders[0].d_state;
                response_data.delivery_add.country = orders[0].d_country;
                response_data.delivery_add.pincode = orders[0].d_pincode;

                // Now get all the picklist items

                let picklistQuery = "";

                switch (tabName) {
                    case "active":
                        picklistQuery = "SELECT \
                            p.name, p.slug, p.image1, p.description, p.sale_price, pp.quantity,\
                            c.name category \
                            FROM products p \
                            JOIN product_picklists pp ON p.id = pp.product_id \
                            JOIN picklists pl ON pl.id = pp.picklist_id \
                            JOIN orders o ON o.order_name = pl.order_name \
                            JOIN categories c ON p.category_id = c.id \
                            WHERE o.status = 'Confirmed' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.updated_at ASC";
                        break;

                    case "rejected":
                        picklistQuery = "SELECT \
                            p.name, p.slug, p.image1, p.description, p.sale_price, pp.quantity,\
                            c.name category \
                            FROM products p \
                            JOIN product_picklists pp ON p.id = pp.product_id \
                            JOIN picklists pl ON pl.id = pp.picklist_id \
                            JOIN orders o ON o.order_name = pl.order_name \
                            JOIN categories c ON p.category_id = c.id \
                            WHERE o.status = 'Rejected' \
                            AND o.is_active = 0 \
                            AND o.id = ? \
                            ORDER BY o.updated_at ASC";
                        break;

                    case "picking":
                        picklistQuery = "SELECT \
                            p.name, p.slug, p.image1, p.description, p.sale_price, pp.quantity,\
                            c.name category \
                            FROM products p \
                            JOIN product_picklists pp ON p.id = pp.product_id \
                            JOIN picklists pl ON pl.id = pp.picklist_id \
                            JOIN orders o ON o.order_name = pl.order_name \
                            JOIN categories c ON p.category_id = c.id \
                            WHERE o.status = 'Picking Items' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.updated_at ASC";
                        break;

                    case "completed":
                        picklistQuery = "SELECT \
                            p.name, p.slug, p.image1, p.description, p.sale_price, pp.quantity,\
                            c.name category \
                            FROM products p \
                            JOIN product_picklists pp ON p.id = pp.product_id \
                            JOIN picklists pl ON pl.id = pp.picklist_id \
                            JOIN orders o ON o.order_name = pl.order_name \
                            JOIN categories c ON p.category_id = c.id \
                            WHERE o.status = 'Picking Completed' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.updated_at ASC";
                        break;

                    case "delivered":
                        picklistQuery = "SELECT \
                            p.name, p.slug, p.image1, p.description, p.sale_price, pp.quantity,\
                            c.name category \
                            FROM products p \
                            JOIN product_picklists pp ON p.id = pp.product_id \
                            JOIN picklists pl ON pl.id = pp.picklist_id \
                            JOIN orders o ON o.order_name = pl.order_name \
                            JOIN categories c ON p.category_id = c.id \
                            WHERE o.status = 'Order Delivered' \
                            AND o.is_active = 0 \
                            AND o.id = ? \
                            ORDER BY o.updated_at ASC";
                        break;

                    default:
                        //new
                        picklistQuery = "SELECT \
                            p.name, p.slug, p.image1, p.description, p.sale_price, pp.quantity,\
                            c.name category \
                            FROM products p \
                            JOIN product_picklists pp ON p.id = pp.product_id \
                            JOIN picklists pl ON pl.id = pp.picklist_id \
                            JOIN orders o ON o.order_name = pl.order_name \
                            JOIN categories c ON p.category_id = c.id \
                            WHERE o.status = 'Received' \
                            AND o.is_active = 1 \
                            AND o.id = ? \
                            ORDER BY o.created_at ASC";
                        break;
                }

                let picklist = await models.sequelize.query(
                    picklistQuery,
                    {
                        replacements: [order_id],
                        type: QueryTypes.SELECT
                    });
                if (picklist) {
                    console.log(picklist);
                    response_data.picklist = picklist;
                }
                console.log("Response data", response_data);
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: `List of all the orders sorted as First Order In First Order Out order.`,
                    data: response_data
                });
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: `No active orders.`,
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
    getStoreDetails: async (req, res) => {
        try {
            let storeDetails = {
                category: {
                    count: 0,
                    list: []
                },
                product: {
                    count: 0,
                    list: []
                },
                new_orders: {
                    count: 0,
                    list: []
                },
                active_orders: {
                    count: 0,
                    list: []
                },
                picking_orders: {
                    count: 0,
                    list: []
                },
                completed_orders: {
                    count: 0,
                    list: []
                },
                rejected_orders: {
                    count: 0,
                    list: []
                },
                delivered_orders: {
                    count: 0,
                    list: []
                },
            };
            let allActiveCategory = await getExisitngActivecategories();
            let allActiveProducts = await getExisitngActiveProducts();
            let allNewOrders = await getOrdersList('Received');
            let allActiveOrders = await getOrdersList('Confirmed');
            let allPickingOrders = await getOrdersList('Picking Items');
            let allCompletedOrders = await getOrdersList('Picking Completed');
            let allRejectedOrders = await getOrdersList('Rejected');
            let allDeliveredOrders = await getOrdersList('Order Delivered');

            if (allActiveCategory) {
                storeDetails.category.count = allActiveCategory.length;
                storeDetails.category.list = await transformImage(allActiveCategory, 'image');
            }

            if (allActiveProducts) {
                storeDetails.product.count = allActiveProducts.length;
                storeDetails.product.list = await transformImage(allActiveProducts, 'image1');
            }

            if (allNewOrders) {
                storeDetails.new_orders.count = allNewOrders.length;
                storeDetails.new_orders.list = allNewOrders;
            }

            if (allActiveOrders) {
                storeDetails.active_orders.count = allActiveOrders.length;
                storeDetails.active_orders.list = allActiveOrders;
            }

            if (allPickingOrders) {
                storeDetails.picking_orders.count = allPickingOrders.length;
                storeDetails.picking_orders.list = allPickingOrders;
            }

            if (allCompletedOrders) {
                storeDetails.completed_orders.count = allCompletedOrders.length;
                storeDetails.completed_orders.list = allCompletedOrders;
            }

            if (allRejectedOrders) {
                storeDetails.rejected_orders.count = allRejectedOrders.length;
                storeDetails.rejected_orders.list = allRejectedOrders;
            }

            if (allDeliveredOrders) {
                storeDetails.delivered_orders.count = allDeliveredOrders.length;
                storeDetails.delivered_orders.list = allDeliveredOrders;
            }

            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: true,
                message: "store details",
                data: storeDetails
            })

        } catch (error) {
            console.log(error);
            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: error.message,
                data: []
            });
        }
    },
    changeOrderStatus: async (req, res) => {
        const { status, order_id, remarks } = req.body;
        console.log("Request received", order_id, status);
        try {
            let count = await models.Order.count({
                where: {
                    id: order_id,
                    is_active: 1
                }
            });

            if (count > 0) {
                const transaction = await models.sequelize.transaction();

                switch (status) {
                    case "Confirm":
                        const result = await models.Order.update({
                            status: constants.STATUS.CN,
                            remarks: constants.STATUS.REMARKS.OCN,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                id: order_id,
                                is_active: 1
                            }
                        }, {
                            transaction: transaction
                        });
                        console.log(result);

                        if (result) {

                            const order = await models.Order.findOne({
                                where: {
                                    id: order_id,
                                    is_active: 1
                                }
                            });

                            if (order) {
                                const plResult = await models.PickList.update({
                                    status: constants.STATUS.CN,
                                    remarks: constants.STATUS.REMARKS.OCN,
                                    updated_at: helpers.currentTime()
                                }, {
                                    where: {
                                        order_name: order.order_name,
                                        is_active: 1
                                    }
                                }, {
                                    transaction: transaction
                                });

                                if (plResult) {

                                    await transaction.commit();

                                    const customer = await getUser(order_id);

                                    let notification_title = constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_ACCEPTED.TITLE;
                                    let notification_body = `${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_ACCEPTED.MESSAGE_I} ${helpers.titleCase(customer[0].first_name)}. ${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_ACCEPTED.MESSAGE_II}`;
                                    console.log(notification_title, notification_body);

                                    notification.send_notification(customer[0].device_id, notification_title, notification_body);

                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: true,
                                        message: "Order Confirmed. This order has been moved to Active Orders List. Thank you!",
                                        data: []
                                    });
                                } else {
                                    await transaction.rollback();
                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: false,
                                        message: "Order Status not changed. Please try again!",
                                        data: []
                                    });
                                }
                            } else {
                                await transaction.rollback();
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: "Order Status not changed. Please try again!",
                                    data: []
                                });
                            }
                        } else {
                            await transaction.rollback();
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "Order Status not changed. Please try again!",
                                data: []
                            });
                        }

                    case "Rejected":
                        const updatedOrder = await models.Order.update({
                            status: constants.STATUS.RJ,
                            remarks: constants.STATUS.REMARKS.ORJ + " " + remarks,
                            is_active: 0,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                id: order_id,
                                is_active: 1
                            }
                        }, {
                            transaction: transaction
                        });
                        console.log(updatedOrder);

                        if (updatedOrder) {
                            console.log("PL rejection", updatedOrder, order_id, remarks);
                            const order = await models.Order.findOne({
                                where: {
                                    id: order_id
                                }
                            });

                            if (order) {
                                const plResp = await models.PickList.update({
                                    status: constants.STATUS.RJ,
                                    remarks: constants.STATUS.REMARKS.ORJ + " " + remarks,
                                    is_active: 0,
                                    updated_at: helpers.currentTime()
                                }, {
                                    where: {
                                        order_name: order.order_name,
                                        is_active: 1
                                    }
                                }, {
                                    transaction: transaction
                                });

                                if (plResp) {

                                    await transaction.commit();

                                    const customer = await getUser(order_id);

                                    let notification_title = constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_REJECTED.TITLE;
                                    let notification_body = `${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_REJECTED.MESSAGE_I} ${helpers.titleCase(customer[0].first_name)}. ${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_REJECTED.MESSAGE_II}`;
                                    console.log(notification_title, notification_body);

                                    notification.send_notification(customer[0].device_id, notification_title, notification_body);

                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: true,
                                        message: "Order Rejected. This order has been moved to Rejected Orders List. Thank you!",
                                        data: []
                                    });
                                } else {
                                    await transaction.rollback();
                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: false,
                                        message: "Order Status not changed. Please try again!",
                                        data: []
                                    });
                                }
                            } else {
                                await transaction.rollback();
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: "Order Status not changed. Please try again!",
                                    data: []
                                });
                            }
                        } else {
                            await transaction.rollback();
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "Order Status not changed. Please try again!",
                                data: []
                            });
                        }

                    case "Process":
                        const order = await models.Order.update({
                            status: constants.STATUS.PL,
                            remarks: constants.STATUS.REMARKS.OPL,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                id: order_id,
                                is_active: 1
                            }
                        }, {
                            transaction: transaction
                        });
                        console.log(order);

                        if (order) {

                            const existingOrder = await models.Order.findOne({
                                where: {
                                    id: order_id,
                                    is_active: 1
                                }
                            });

                            if (existingOrder) {
                                const plResp = await models.PickList.update({
                                    status: constants.STATUS.PL,
                                    remarks: constants.STATUS.REMARKS.OPL,
                                    updated_at: helpers.currentTime()
                                }, {
                                    where: {
                                        order_name: existingOrder.order_name,
                                        is_active: 1
                                    }
                                }, {
                                    transaction: transaction
                                });

                                if (plResp) {

                                    await transaction.commit();

                                    const customer = await getUser(order_id);

                                    let notification_title = constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_PICKING.TITLE;
                                    let notification_body = `${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_PICKING.MESSAGE_I} ${helpers.titleCase(customer[0].first_name)}. ${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_PICKING.MESSAGE_II}`;
                                    console.log(notification_title, notification_body);

                                    notification.send_notification(customer[0].device_id, notification_title, notification_body);

                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: true,
                                        message: "Order Status Updated to Picking.",
                                        data: []
                                    });
                                } else {
                                    await transaction.rollback();
                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: false,
                                        message: "Order Status not changed. Please try again!",
                                        data: []
                                    });
                                }
                            } else {
                                await transaction.rollback();
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: "Order Status not changed. Please try again!",
                                    data: []
                                });
                            }
                        } else {
                            await transaction.rollback();
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "Order Status not changed. Please try again!",
                                data: []
                            });
                        }

                    case "Completed":
                        const completedOrder = await models.Order.update({
                            status: constants.STATUS.PC,
                            remarks: constants.STATUS.REMARKS.OPC,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                id: order_id,
                                is_active: 1
                            }
                        }, {
                            transaction: transaction
                        });
                        console.log(completedOrder);

                        if (completedOrder) {

                            const existingOrder = await models.Order.findOne({
                                where: {
                                    id: order_id,
                                    is_active: 1
                                }
                            });

                            if (existingOrder) {
                                const plResp = await models.PickList.update({
                                    status: constants.STATUS.PC,
                                    remarks: constants.STATUS.REMARKS.OPC,
                                    updated_at: helpers.currentTime()
                                }, {
                                    where: {
                                        order_name: existingOrder.order_name,
                                        is_active: 1
                                    }
                                }, {
                                    transaction: transaction
                                });

                                if (plResp) {

                                    await transaction.commit();

                                    const customer = await getUser(order_id);

                                    let notification_title = constants.NOTIFICATION.STATUS_NOTIFICATION.PICKING_COMPLETED.TITLE;
                                    let notification_body = `${constants.NOTIFICATION.STATUS_NOTIFICATION.PICKING_COMPLETED.MESSAGE_I} ${helpers.titleCase(customer[0].first_name)}. ${constants.NOTIFICATION.STATUS_NOTIFICATION.PICKING_COMPLETED.MESSAGE_II}`;

                                    notification.send_notification(customer[0].device_id, notification_title, notification_body);

                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: true,
                                        message: "Order Status Updated to Completed.",
                                        data: []
                                    });
                                } else {
                                    await transaction.rollback();
                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: false,
                                        message: "Order Status not changed. Please try again!",
                                        data: []
                                    });
                                }
                            } else {
                                await transaction.rollback();
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: "Order Status not changed. Please try again!",
                                    data: []
                                });
                            }
                        } else {
                            await transaction.rollback();
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "Order Status not changed. Please try again!",
                                data: []
                            });
                        }

                    case "Deliver":
                        const deliverOrder = await models.Order.update({
                            status: constants.STATUS.DL,
                            remarks: constants.STATUS.REMARKS.ODL,
                            is_active: 0,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                id: order_id,
                                is_active: 1
                            }
                        }, {
                            transaction: transaction
                        });
                        console.log("Deliver order", deliverOrder.order_name);

                        if (deliverOrder) {
                            console.log("inside delivery order")
                            const existingOrder = await models.Order.findOne({
                                where: {
                                    id: order_id,
                                    is_active: 0
                                }
                            });
                            console.log("existi", existingOrder)
                            if (existingOrder) {
                                const plResp = await models.PickList.update({
                                    status: constants.STATUS.DL,
                                    remarks: constants.STATUS.REMARKS.ODL,
                                    is_active: 0,
                                    updated_at: helpers.currentTime()
                                }, {
                                    where: {
                                        order_name: existingOrder.order_name,
                                        is_active: 1
                                    }
                                }, {
                                    transaction: transaction
                                });

                                if (plResp) {

                                    await transaction.commit();

                                    const customer = await getUser(order_id);

                                    let notification_title = constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_DELIVERED.TITLE;
                                    let notification_body = `${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_DELIVERED.MESSAGE_I} ${helpers.titleCase(customer[0].first_name)}. ${constants.NOTIFICATION.STATUS_NOTIFICATION.ORDER_DELIVERED.MESSAGE_II}`;

                                    notification.send_notification(customer[0].deviceid, notification_title, notification_body);

                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: true,
                                        message: "Order Status Updated to Delivered.",
                                        data: []
                                    });
                                } else {
                                    await transaction.rollback();
                                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                                        status: false,
                                        message: "Order Status not changed. Please try again!",
                                        data: []
                                    });
                                }
                            } else {
                                await transaction.rollback();
                                return res.status(constants.STATUS_CODE.SUCCESS).json({
                                    status: false,
                                    message: "Order Status not changed. Please try again!",
                                    data: []
                                });
                            }
                        } else {
                            await transaction.rollback();
                            return res.status(constants.STATUS_CODE.SUCCESS).json({
                                status: false,
                                message: "Order Status not changed. Please try again!",
                                data: []
                            });
                        }

                    default:

                        break;
                }
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "Order not found. Please try again!",
                    data: []
                })
            }
        } catch (error) {

        }
    }
}

let transformImage = async (items, fieldName) => {
    if (fieldName === 'image1') items.map((x) => x.image1 = 'public/uploads/' + x.image1);
    if (fieldName === 'image') items.map((x) => x.image = 'public/uploads/' + x.image);
    console.log('items transforemd', items)
    return items;
}

let getExisitngActivecategories = async () => {
    let activeCategory = await models.Category.findAll({
        where: {
            is_active: 1
        },
        attributes: {
            exclude: ['is_active', 'created_at', 'updated_at']
        },
        order: [
            ['name', 'ASC']
        ]
    });


    return activeCategory;
}

let getExisitngActiveProducts = async () => {
    let activeProduct = await models.Product.findAll({
        where: {
            is_active: 1
        },
        attributes: {
            exclude: ['is_active', 'created_at', 'updated_at']
        },
        order: [
            ['name', 'ASC'],
            ['category_id', 'ASC'],
            ['slug', 'ASC']
        ]
    });


    return activeProduct;
}

let getExisitngParticularProduct = async (category_id, name) => {
    console.log("Looking for", category_id, name);
    let activeProduct = await models.Product.findAndCountAll({
        where: {
            category_id: category_id,
            name: helpers.titleCase(name)
        }
    });


    return activeProduct;
}

let getOrdersList = async (flag) => {

    if (flag != "Rejected" && flag != "Order Delivered") {

        let orders = await models.Order.findAll({
            where: {
                status: flag,
                is_active: 1
            },
            attributes: {
                exclude: ['remarks', 'updated_at']
            },
            order: [
                ['created_at', 'DESC']
            ]
        });

        return orders;
    } else {
        let orders = await models.Order.findAll({
            where: {
                status: flag,
                is_active: 0
            },
            attributes: {
                exclude: ['remarks', 'updated_at']
            },
            order: [
                ['created_at', 'DESC']
            ]
        });

        return orders;
    }

}

let removeImage = async (flag, id, model) => {
    console.log("Looking for", flag, id);
    let sourceUrls = "";
    if (flag === "remove_new_file") {
        sourceUrls = `./public/uploads/${global.fileUploadeWithName}`;
    } else {
        if (model === "products") {
            activeProduct = await models.Product.findByPk(id);
            sourceUrls = `./public/uploads/${activeProduct.image1}`;
        } else if (model === "category") {
            activeCategory = await models.Category.findByPk(id);
            sourceUrls = `./public/uploads/${activeCategory.image}`;
        }
    }

    fs.unlinkSync(sourceUrls);
}

let getUser = async (order_id) => {

    const userQuery = `SELECT u.first_name, u.last_name, u.device_id, o.order_name FROM users u JOIN orders o ON u.id = o.user_id WHERE o.id = ? AND u.is_active = 1`
    const users = await models.sequelize.query(
        userQuery,
        {
            replacements: [order_id],
            type: QueryTypes.SELECT
        });
    console.log("User: ", users[0]);

    return users;
}

module.exports = AdminController;
