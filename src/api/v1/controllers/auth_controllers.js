
require('dotenv').config();
const models = require('../../../config/db_config');
const helpers = require('../helpers/helpers')
const constants = require('../../../config/constants');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

const AuthController = {
    login: async (req, res) => {

        const { mobile, device_id } = await req.body;

        const transaction = await models.sequelize.transaction();

        try {
            let user = await models.User.findOne({
                where: {
                    mobile: mobile,
                    is_active: 1
                },
            });

            if (user) {
                user.device_id = device_id;
                console.log(`User ${user}`);
                // Existing user, update the device_id

                if (device_id != "") {
                    await models.User.update({
                        device_id: device_id,
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                }

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Login Successful!",
                    data: user
                });

            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "User not found. Try registering yourself.",
                    data: []
                });
            }

        } catch (err) {
            await transaction.rollback();

            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: err.message,
                data: []
            });
        }
    },
    register: async (req, res) => {

        let { first_name, last_name, phone_no, device_id, address, landmark, city, state, pincode } = req.body;
        let new_user_id = 0;
        const transaction = await models.sequelize.transaction();

        try {
            let user = await models.User.findOne({
                where: {
                    mobile: phone_no,
                    is_active: 1
                },
            });

            if (user) {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: 'Phone number is already registered!',
                    data: []
                });
            } else {
                // If new user then register
                let user_payload = {
                    mobile: phone_no,
                    role: 'user',
                    is_active: 1
                };

                let token = await jwt.sign(user_payload, process.env.APP_SECRET_KEY);

                await models.User.create({
                    first_name: helpers.titleCase(first_name),
                    last_name: helpers.titleCase(last_name),
                    role: 'user',
                    mobile: phone_no,
                    device_id: device_id,
                    api_token: token,
                    address: helpers.titleCase(address),
                    landmark: helpers.titleCase(landmark),
                    city: helpers.titleCase(city),
                    state: helpers.titleCase(state),
                    country: 'India',
                    pincode: pincode,
                    is_active: 1,
                    created_at: helpers.currentTime(),
                    updated_at: helpers.currentTime()
                }, {
                    transaction: transaction,
                }).then(result => new_user_id = result.id);

                await models.UserAddress.create({
                    user_id: new_user_id,
                    contact: phone_no,
                    first_name: helpers.titleCase(first_name),
                    last_name: helpers.titleCase(last_name),
                    address: helpers.titleCase(address),
                    landmark: helpers.titleCase(landmark),
                    city: helpers.titleCase(city),
                    state: helpers.titleCase(state),
                    country: 'India',
                    pincode: pincode,
                    is_active: 1,
                    is_default: 1,
                    created_at: helpers.currentTime(),
                    updated_at: helpers.currentTime()
                }, {
                    transaction: transaction
                });

                await transaction.commit();

                user_payload.api_token = token;
                console.log("New user id: ", new_user_id);
                let userData = {};

                if (new_user_id > 0) {
                    console.log("Getting created user data");
                    userData = await models.User.findOne({
                        where: {
                            id: new_user_id
                        }
                    });

                    console.log("New user data retrived", userData);

                    if (userData) {
                        return res.status(constants.STATUS_CODE.SUCCESS).json({
                            status: true,
                            message: 'Registration Successfull!',
                            data: userData
                        });
                    } else {
                        await transaction.rollback();

                        return res.status(constants.STATUS_CODE.FAIL).json({
                            status: false,
                            message: "Registration unsuccessfull. Please try again later.",
                            data: []
                        });
                    }

                } else {
                    console.log("Created new user id is the issue. New user id is", new_user_id);

                    await transaction.rollback();

                    return res.status(constants.STATUS_CODE.FAIL).json({
                        status: false,
                        message: "Registration unsuccessfull. Please try again later.",
                        data: []
                    });
                }

            }

        } catch (err) {
            await transaction.rollback();

            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: err.message,
                data: []
            });
        }
    },
    getUserData: async (req, res) => {

        const { user_id } = await req.params;
        console.log("User id is", user_id);
        try {
            let user = await models.User.findOne({
                where: {
                    id: user_id,
                    is_active: 1
                },
            });

            if (user) {

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "User Current Data!",
                    data: user
                });

            } else {
                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: false,
                    message: "User not found.",
                    data: []
                });
            }

        } catch (err) {

            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: err.message,
                data: []
            });
        }
    },
    newOrder: async (req, res) => {
        const { user_id, order_details, order_type } = req.body;

        console.log("user_id: " + user_id, order_details, order_type);
        const transaction = await models.sequelize.transaction();
        try {
            // Create Unique Order ID for Order name
            const order_name = await helpers.generateAlphaNumericUID(16);
            // Find User
            const user = await models.User.findOne({
                where: {
                    id: user_id
                }
            });

            if (user.is_active == 1 &&
                user.address != null &&
                user.city != null &&
                user.state != null &&
                user.pincode != null) {
                //Create new transaction
                console.log("User is status and order name", user.is_active, order_name);
                let new_order_id = 0;
                let new_picklist_id = 0;

                let newOrder = await models.Order.create({
                    order_name: order_name,
                    order_type: order_type,
                    user_id: user_id,
                    status: constants.STATUS.RC,
                    remarks: constants.STATUS.REMARKS.ORC,
                    is_active: 1,
                    created_at: helpers.currentTime(),
                    updated_at: helpers.currentTime()
                }, {
                    transaction: transaction
                }).then(result => new_order_id = result.id);

                console.log("New order id generated", new_order_id, newOrder);

                if (new_order_id != 0) {
                    /*****************************************************************
                        Once order has been created. Then create a new picklist.
                        Picklist will hold the order different status and we will update the latest picklist with the 
                        product list in order_picklists table
                     *****************************************************************/
                    let pickList = await models.PickList.create({
                        order_name: order_name,
                        order_type: order_type,
                        status: constants.STATUS.PR,
                        remarks: constants.STATUS.REMARKS.OPR,
                        is_active: 1,
                        created_at: helpers.currentTime(),
                        updated_at: helpers.currentTime()
                    }, {
                        transaction: transaction
                    }).then(result => new_picklist_id = result.id);
                    console.log("New Picklist id", new_picklist_id)
                    if (new_picklist_id != 0) {
                        /*****************************************************************
                            Picklist created and order received.
                            Once we create a picklist, the order will be under processing state and the picklist will be
                            linked with the products in product_picklists table.

                            Every items in the order will be created using the same picklist id
                        *****************************************************************/
                        console.log("order details", order_details, order_details.length);
                        for (let index = 0; index < order_details.length; index++) {
                            const element = order_details[index];
                            if (element.product_id != null && element.product_id != 0) {
                                console.log("product id", element.product_id);
                                await models.ProductPickList.create({
                                    product_id: element.product_id,
                                    picklist_id: new_picklist_id,
                                    quantity: element.quantity,
                                    is_active: 1,
                                    status: constants.STATUS.REMARKS.PLRC,
                                    created_at: helpers.currentTime(),
                                    updated_at: helpers.currentTime()
                                }, {
                                    transaction: transaction
                                });
                            }
                        }

                        await transaction.commit();

                        return res.status(constants.STATUS_CODE.SUCCESS).json({
                            status: true,
                            message: constants.STATUS.REMARKS.OPR,
                            data: []
                        });
                    } else {
                        await transaction.rollback();
                        return res.status(constants.STATUS_CODE.FAIL).json({
                            status: false,
                            message: "Picklist couldn\'t be created. Please try again.",
                            data: []
                        });
                    }
                } else {
                    return res.status(constants.STATUS_CODE.FAIL).json({
                        status: true,
                        message: "Order couldn\'t be created. Please try again.",
                        data: []
                    });
                }
            }

            console.log("user", user);

            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: true,
                message: "data.",
                data: []
            });
        } catch (error) {
            await transaction.rollback();
            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: error.message,
                data: []
            });
        }

    },
    getAllAddress: async (req, res) => {
        const user_id = req.params.user_id;

        console.log("user id", user_id);

        try {
            user = await models.User.findOne({
                where: {
                    id: user_id,
                    is_active: 1
                }
            });

            if (user) {
                const addresses = await models.UserAddress.findAll({
                    where: {
                        user_id: user_id,
                    }
                });

                if (addresses) {
                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                        status: true,
                        message: "List of all addresses found",
                        data: addresses
                    })
                } else {
                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                        status: false,
                        message: "Address not found",
                        data: []
                    });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(constants.STATUS_CODE.SUCCESS).json({
                status: false,
                message: "Something went wrong! Please try again later.",
                data: []
            });
        }
    },
    updateDeliveryAddress: async (req, res) => {
        const { address_id, user_id, first_name, last_name, contact, address, landmark, city, state, pincode, is_default } = req.body;

        try {
            // First verify user and address 
            const user = await models.User.findOne({
                where: {
                    id: user_id,
                    is_active: 1
                }
            });

            console.log("user length", user.id);

            if (user.id > 0) {
                const addressRes = await models.UserAddress.findOne({
                    where: {
                        id: address_id,
                        user_id: user_id
                    }
                });

                console.log("address res", addressRes.id);

                if (addressRes.id > 0) {

                    if (is_default) {
                        let user_payload = {
                            address: address,
                            landmark: landmark,
                            city: city,
                            state: state,
                            pincode: pincode,
                            updated_at: helpers.currentTime(),
                        }

                        let payload = {
                            first_name: first_name,
                            last_name: last_name,
                            contact: contact,
                            address: address,
                            landmark: landmark,
                            city: city,
                            state: state,
                            pincode: pincode,
                            updated_at: helpers.currentTime(),
                        }

                        const transaction = await models.sequelize.transaction();

                        payload.is_active = 1;
                        console.log("updated payload", payload);

                        await models.User.update(user_payload, {
                            where: {
                                id: user_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await models.UserAddress.update({
                            is_active: 0
                        }, {
                            where: {
                                user_id: user_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await models.UserAddress.update(payload, {
                            where: {
                                id: address_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await transaction.commit();
                    } else {
                        let payload = {
                            first_name: first_name,
                            last_name: last_name,
                            contact: contact,
                            address: address,
                            landmark: landmark,
                            city: city,
                            state: state,
                            pincode: pincode,
                            updated_at: helpers.currentTime(),
                        }

                        await models.UserAddress.update(payload, {
                            where: {
                                id: address_id
                            }
                        });
                    }
                } else {
                    return res.status(constants.STATUS_CODE.FAIL).json({
                        status: false,
                        message: "Address not found!",
                        data: []
                    });
                }

                const addressResult = await models.UserAddress.findAll({
                    where: {
                        user_id: user_id
                    }
                });

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Address changed successfully!",
                    data: addressResult
                });
            } else {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: "User not found!",
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
    changeDeliveryAddress: async (req, res) => {
        const { address_id, user_id, is_default } = req.body;
        console.log(address_id, user_id, is_default)
        try {
            // First verify user and address 
            const user = await models.User.findOne({
                where: {
                    id: user_id,
                    is_active: 1
                }
            });

            console.log("user length", user.id);

            if (user.id > 0) {
                const addressRes = await models.UserAddress.findOne({
                    where: {
                        id: address_id,
                        user_id: user_id
                    }
                });

                console.log("address res", addressRes.id);

                if (addressRes.id > 0) {
                    let payload = {
                        address: addressRes.address,
                        landmark: addressRes.landmark,
                        city: addressRes.city,
                        state: addressRes.state,
                        pincode: addressRes.pincode,
                        updated_at: helpers.currentTime(),
                    }

                    if (is_default) {
                        const transaction = await models.sequelize.transaction();

                        await models.User.update(payload, {
                            where: {
                                id: user_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await models.UserAddress.update({
                            is_active: 0,
                            is_default: 0
                        }, {
                            where: {
                                user_id: user_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await models.UserAddress.update({
                            is_active: 1,
                            is_default: 1
                        }, {
                            where: {
                                id: address_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await transaction.commit();
                    } else {

                        await models.UserAddress.update({
                            is_active: 0
                        }, {
                            where: {
                                user_id: user_id
                            }
                        });

                        await models.UserAddress.update({
                            is_active: 1
                        }, {
                            where: {
                                id: address_id
                            }
                        });
                    }
                } else {
                    return res.status(constants.STATUS_CODE.FAIL).json({
                        status: false,
                        message: "Address not found!",
                        data: []
                    });
                }

                const addressResult = await models.UserAddress.findAll({
                    where: {
                        user_id: user_id
                    },
                    order: [
                        ['is_default', 'DESC'],
                        ['created_at', 'ASC']
                    ]
                });

                return res.status(constants.STATUS_CODE.SUCCESS).json({
                    status: true,
                    message: "Address changed successfully!",
                    data: addressResult
                });
            } else {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: "User not found!",
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
    addNewAddress: async (req, res) => {
        let { first_name, last_name, is_default, phone_no, address, landmark, city, state, pincode, user_id } = req.body;

        const transaction = await models.sequelize.transaction();

        try {
            let user = await models.User.findOne({
                where: {
                    id: user_id,
                    is_active: 1
                },
            });


            if (user) {

                // Check Address
                duplicateAddress = await models.UserAddress.findOne({
                    where: {
                        address: helpers.titleCase(address),
                        city: helpers.titleCase(city),
                        state: helpers.titleCase(state),
                        landmark: helpers.titleCase(landmark),
                        pincode: helpers.titleCase(pincode)
                    }
                });

                if (duplicateAddress) {
                    return res.status(constants.STATUS_CODE.FAIL).json({
                        status: false,
                        message: "Address already exists",
                        data: []
                    })
                } else {

                    if (is_default) {

                        await models.User.update({
                            address: helpers.titleCase(address),
                            landmark: helpers.titleCase(landmark),
                            city: helpers.titleCase(city),
                            state: helpers.titleCase(state),
                            country: 'India',
                            pincode: pincode,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                id: user_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await models.UserAddress.update({
                            is_active: 0,
                            is_default: 0,
                            updated_at: helpers.currentTime()
                        }, {
                            where: {
                                user_id: user_id
                            }
                        }, {
                            transaction: transaction
                        });

                        await models.UserAddress.create({
                            user_id: user_id,
                            contact: phone_no,
                            first_name: helpers.titleCase(first_name),
                            last_name: helpers.titleCase(last_name),
                            address: helpers.titleCase(address),
                            landmark: helpers.titleCase(landmark),
                            city: helpers.titleCase(city),
                            state: helpers.titleCase(state),
                            country: 'India',
                            pincode: pincode,
                            is_active: 1,
                            is_default: 1,
                            created_at: helpers.currentTime(),
                            updated_at: helpers.currentTime()
                        }, {
                            transaction: transaction
                        });

                    } else {
                        await models.UserAddress.create({
                            user_id: user_id,
                            contact: phone_no,
                            first_name: helpers.titleCase(first_name),
                            last_name: helpers.titleCase(last_name),
                            address: helpers.titleCase(address),
                            landmark: helpers.titleCase(landmark),
                            city: helpers.titleCase(city),
                            state: helpers.titleCase(state),
                            country: 'India',
                            pincode: pincode,
                            is_active: 0,
                            is_default: 0,
                            created_at: helpers.currentTime(),
                            updated_at: helpers.currentTime()
                        });
                    }

                    await transaction.commit();

                    const addresses = await models.UserAddress.findAll({
                        where: {
                            user_id: user_id
                        }
                    });

                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                        status: true,
                        message: "Address added successfully!",
                        data: addresses
                    });
                }
            } else {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: "User not found!",
                    data: []
                });
            }

        } catch (err) {
            await transaction.rollback();

            return res.status(constants.STATUS_CODE.FAIL).json({
                status: false,
                message: err.message,
                data: []
            });
        }
    },
    deleteAddress: async (req, res) => {
        const { user_id, address_id } = req.params;

        try {
            let user = await models.User.findOne({
                where: {
                    id: user_id,
                    is_active: 1
                },
            });

            if (user) {

                // Check Address
                defaultAddress = await models.UserAddress.findOne({
                    where: {
                        id: address_id,
                        is_default: 1
                    }
                });

                if (defaultAddress) {
                    return res.status(constants.STATUS_CODE.SUCCESS).json({
                        status: false,
                        message: "You cannot delete your default address.",
                        data: []
                    });
                } else {
                    const result = await models.UserAddress.destroy({
                        where: {
                            id: address_id
                        }
                    });

                    if (result) {
                        const addresses = await models.UserAddress.findAll({
                            where: {
                                user_id: user_id
                            }
                        });

                        return res.status(constants.STATUS_CODE.SUCCESS).json({
                            status: true,
                            message: "Address deleted successfully!",
                            data: addresses
                        });
                    } else {
                        return res.status(constants.STATUS_CODE.FAIL).json({
                            status: false,
                            message: "Coundn't delete the address. Please try again!",
                            data: []
                        });
                    }

                }
            }
            else {
                return res.status(constants.STATUS_CODE.FAIL).json({
                    status: false,
                    message: "Coundn't delete the address. Please try again!",
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
    }
}

module.exports = AuthController;