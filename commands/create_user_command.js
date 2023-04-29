
require('dotenv').config();
const yargsInteractive = require("yargs-interactive");
const dateHelpers = require('../src/api/v1/helpers/helpers');
const jwt = require('jsonwebtoken');

const options = {
    interactive: { default: true },
    first_name: {
        type: "input",
        describe: "Enter first name"
    },
    last_name: {
        type: "input",
        describe: "Enter last name"
    },
    mobile: {
        type: "input",
        describe: "Enter mobile number"
    },
    role: {
        type: "input",
        describe: "Enter role"
    },
    is_active: {
        type: "input",
        describe: "Do you want to keep this user active? enter [active 1] [inactive 0]"
    }
};

yargsInteractive()
    .usage("$0 <command> [args]")
    .interactive(options)
    .then(async (result) => {
        const models = await require('../src/config/db_config');
        const user = await models.User.findOne({
            where: {
                mobile: result.mobile,
                role: result.role,
                is_active: 1
            }
        });

        if (user) {
            console.log("User already exists");

            return;
        }

        let user_payload = {
            mobile: result.mobile,
            role: result.role,
            is_active: 1
        };

        let _token = await jwt.sign(user_payload, process.env.APP_SECRET_KEY);

        user_payload.api_token = _token;

        const newUser = await models.User.create({
            first_name: result.first_name,
            last_name: result.last_name,
            mobile: result.mobile,
            device_id: 'rrmart_device',
            api_token: _token,
            address: "abc",
            landmark: "def",
            city: "ghi",
            state: "jkl",
            country: "India",
            pincode: "100000",
            role: result.role,
            is_active: 1,
            created_at: dateHelpers.currentTime(),
            updated_at: dateHelpers.currentTime()
        });

        console.log(`Created '${newUser.first_name} ${newUser.last_name}' as a new user successfully`);

        return;
    });