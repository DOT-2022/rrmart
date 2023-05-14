
const models = require('../../../config/db_config');
const helpers = require('../helpers/helpers');
const { QueryTypes } = require('sequelize');
const constants = require('../../../config/constants');
var fs = require('fs');

const AdminController = {
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
        const image = req.file;

        try {
            let existingCategory = await models.Category.findByPk(id);

            if (existingCategory) {

                let updateResp = await models.Category.update({
                    name: helpers.titleCase(name),
                    slug: helpers.slug(slug),
                    image: image.filename,
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
    updateProduct: async (req, res) => {
        const { id, name, slug, category_id, description, actual_price, sale_price, is_active } = req.body;
        const image = req.file;
        console.log("filename", global.fileUploadeWithName);

        try {
            let existingProduct = await models.Product.findByPk(id);

            if (existingProduct) {
                console.log("product", existingProduct);
                if (existingProduct.category_id == category_id) {
                    console.log("category_id", category_id, typeof (category_id), 'exusting category_id', existingProduct.category_id, typeof (existingProduct.category_id));
                    // After Updating the image name in the db, we need to delete the old
                    // image from the storage.
                    await removeImage('remove_old_file', id);

                    // Updating the product details without changing the category
                    let updateResp = await models.Product.update({
                        name: helpers.titleCase(name),
                        slug: helpers.slug(slug),
                        category_id: category_id,
                        image1: image.filename,
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

                        // After Updating the image name in the db, we need to delete the old
                        // image from the storage.
                        await removeImage('remove_old_file', id);

                        let updateResp = await models.Product.update({
                            name: helpers.titleCase(name),
                            slug: helpers.slug(slug),
                            category_id: category_id,
                            image1: image.filename,
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
                        // After Updating the image name in the db, we need to delete the old
                        // image from the storage.
                        await removeImage('remove_new_file', 0);
                        return res.status(constants.STATUS_CODE.FAIL).json({
                            status: false,
                            message: "Product under this category already exists.",
                            data: []
                        });
                    }
                }

            } else {
                // After Updating the image name in the db, we need to delete the old
                // image from the storage.
                await removeImage('remove_new_file', 0);
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: "Update failed. No such product exists.",
                    data: []
                });
            }
        } catch (error) {
            // After Updating the image name in the db, we need to delete the old
            // image from the storage.
            console.log(error.message);
            await removeImage('remove_new_file', 0);
            return res.status(404).json({
                status: false,
                message: `Couldn't find active product`,
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
        const order_id = req.params.order_id;

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
            picklist: []
        };

        const oldestOrderQuery = "SELECT \
                u.first_name, u.last_name, u.mobile, u.address, u.landmark, u.city, u.state, u.country, u.pincode, \
                o.id order_id, o.order_name, o.order_type, o.status, o.remarks, o.created_at \
                FROM users u \
                JOIN orders o ON o.user_id = u.id \
                WHERE o.status = 'Received' \
                AND o.is_active = 1 \
                AND o.id = ? \
                ORDER BY o.created_at ASC";
        try {
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

                // Now get all the picklist items

                const picklistQuery = "SELECT \
                        p.name, p.slug, p.image1, p.image2, p.description, p.actual_price, p.sale_price, p.is_active prduct_is_active,\
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

                const picklist = await models.sequelize.query(
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
    updateOrderStatus: async (req, res) => {
        const { order_id, status, remarks } = req.params;

        try {
            // Step 1: Find the order with order id
            const orders = await models.Order.findOne({
                where: {
                    id: order_id,
                    is_active: 1
                }
            });

            if (orders) {
                switch (status) {
                    case 'rejected':
                        if (remarks != "") {
                            await models.Order.update({
                                status: constants.STATUS.RJ,
                                re
                            });
                        }
                        break;

                    default:
                        break;
                }
            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "Sorry, we are not able to find such order. Please try again.",
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
            let allRejectedOrders = await getOrdersList('Rejected');
            let allDeliveredOrders = await getOrdersList('Delivered');

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

            if (allRejectedOrders) {
                storeDetails.rejected_orders.count = allRejectedOrders.length;
                storeDetails.rejected_orders.list = allRejectedOrders;
            }

            if (allActiveOrders) {
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
    }
}

let transformImage = async (items, fieldName) => {
    if (fieldName === 'image1') items.map((x) => x.image1 = 'public/uploads/' + x.image1);;
    if (fieldName === 'image') items.map((x) => x.image = 'public/uploads/' + x.image);;
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

    query = 'select o.id, o.order_name, o.'

    return orders;
}

let removeImage = async (flag, id) => {
    console.log("Looking for", flag, id);
    let sourceUrls = "";
    if (flag === "remove_new_file") {
        sourceUrls = `./public/uploads/${global.fileUploadeWithName}`;
    } else {
        activeProduct = await models.Product.findByPk(id);
        sourceUrls = `./public/uploads/${activeProduct.image1}`;
    }
    fs.unlinkSync(sourceUrls);
}


module.exports = AdminController;