require('dotenv').config();
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const constants = require('../../../config/constants');
const models = require('../../../config/db_config');

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.APP_SECRET_KEY,
};

module.exports = passport => {
    passport.use(
        new JWTStrategy(opts, (jwt_payload, next) => {
            console.log(jwt_payload.mobile);
            models.User
                .findOne({
                    mobile: jwt_payload.mobile,
                    is_active: '1'
                })
                .then(user => {
                    if (user) {
                        return next(null, user);
                    }
                    return next(null, false);
                })
                .catch(err => console.log("PASSPORT ERROR: ", err));
        })
    );
};