const bcrypt = require('bcrypt');
const moment = require('moment');

helpers = {
    joinFirstAndLastName: (fname, lname) => {
        return fname.charAt(0).toUpperCase() + fname.slice(1) + ' ' + lname.charAt(0).toUpperCase() + lname.slice(1);
    },

    firstLetterCapitalized: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    titleCase: (str) => {
        return str.trim().toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    },

    slug: (str) => {
        return str.trim()
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    },

    trim: (data) => {
        if (typeof data != "object") {
            return "Data Param should be Object"
        }

        let trimmedData = {};

        for (const datum in data) {
            if (typeof data[datum] == "string") {
                trimmedData[datum] = data[datum].trim();
            } else {
                trimmedData[datum] = data[datum];
            }
        };

        return trimmedData;
    },

    generateHash: async (plainText) => {
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        const hashedString = await bcrypt.hash(plainText, salt);
        console.log('Hash String: ', hashedString);

        return hashedString;
    },

    generateSixDigitOTP: () => {
        return Math.floor(100000 + Math.random() * 900000);
    },

    generateAlphaNumericUID: (length) => {
        // random_alphabets = Math.random().toString(36).slice(2);
        // random_number = Math.floor(10000000 + Math.random() * 9999999);

        var str = '';
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.split(
            '');
        var charsLen = chars.length;
        if (!length) {
            length = ~~(Math.random() * charsLen);
        }
        for (var i = 0; i < length; i++) {
            str += chars[~~(Math.random() * charsLen)];
        }
        return str;
    },

    paginate: (page, pageSize) => {
        const offset = page * pageSize;
        const limit = pageSize;
        return {
            offset,
            limit
        }
    },

    currentTime: () => {
        return new moment().unix();
    },

    convertDateToEpoch: (date, format = "DD-MM-YYYY") => {
        if (!date) {
            return;
        }

        // if(!dateHelpers.isValid(date, format)) {
        //     return "Date Format should be in " + format
        // }

        return new moment(date, format).unix();
    },

    convertEpochToDate: (epoch, format = "DD-MM-YYYY") => {
        if (!epoch) {
            return;
        }

        return new moment.unix(epoch).format(format);
    },

    currentnewDate: (date) => {
        console.log(date)
        return new moment(date, ["DD-MM-YYYY"]).format();
    },

    currentHumanTime: () => {
        return new moment().format("DD-MM-YYYY h:m:s");
    },

    getDiffrenceBtwen_days: (from, to) => {
        var start = moment(from, "DD-MM-YYYY");
        var end = moment(to, "DD-MM-YYYY");
        return moment.duration(end.diff(start)).asDays();
    },

    currentHumanTimeStamp: () => {
        return new moment().format("YYYY-MM-DD HH:mm:ss");//24hrs formate
    },

    convertHumanDate: (date) => {
        return new moment(date, ["DD-MM-YYYY"]).format("YYYY-MM-DD");
    },

    currentWeekStartDate: () => {
        return new moment().startOf('week').format("YYYY-MM-DD");
    },

    currentWeekEndDate: () => {
        return new moment().endOf('week').format("YYYY-MM-DD");
    },

    isValidDate: (date, format = "DD-MM-YYYY") => {
        var date = moment(date, format, true);

        return date.isValid();
    },

    timeDifferenceInMinutes: (start, end) => {
        start = moment.unix(start);
        end = moment.unix(end);
        var diff = Math.ceil(moment.duration(end.diff(start)).asMinutes());

        return diff;
    },
}

module.exports = helpers;