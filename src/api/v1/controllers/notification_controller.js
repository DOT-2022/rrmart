
require('dotenv').config();
const constants = require('../../../config/constants');
const fetch = require('node-fetch');

const NotificationController = {
    send_notification: async (device_id, notification_title, notification_msg) => {
        console.log("Inside send notification", device_id, notification_title, notification_msg);
        //if (device_id != '' and notification_title != '' and notification_body != '') {
        let notification = {
            title: notification_title,
            body: notification_msg
        }

        let fcm_token = [device_id]

        let notification_body = {
            notification: notification,
            registration_ids: fcm_token
        }

        let responseData = {
            status: false,
            message: ''
        }

        console.log("inside notification controller", process.env.FCM_SECRET_KEY);

        await fetch(constants.NOTIFICATION.FCM_BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `key=${process.env.FCM_SECRET_KEY}`,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(notification_body)
        }).then(response => {

            if (response.status == 200) {
                responseData.status = true;
                responseData.message = "OTP sent successfully. Check your device notification section for OTP."
            } else {
                responseData.status = false;
                responseData.message = "OTP not sent. Please try again later."
            }
            console.log('notification response', responseData);
        }).catch(err => {
            console.log('Notification error: ', err)
            responseData.status = false;
            responseData.message = err.message;
        })
        return responseData;
        // } else {
        //     let responseData = {
        //         status: false,
        //         message: 'Device ID, Notification Title, Notification Body is required.'
        //     }
        //     return responseData;
        // }
    },
}

module.exports = NotificationController;