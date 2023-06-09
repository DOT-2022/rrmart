require('dotenv').config();

const constants = {
    STATUS_CODE: {
        FAIL: 401,
        UNAUTHORIZED: 403,
        NOT_FOUND: 404,
        TIME_OUT: 500,
        SUCCESS: 200
    },
    KEYS: {
        PASSPORT_KEY: 'rr_mart_2023_V1',
    },
    BASE_URL: {
        LOCAL: `http://localhost:${process.env.PORT}/api/v1/`,
        PRODUCTION: 'http://43.205.209.86:${process.env.PORT}/api/v1/'
    },
    NOTIFICATION: {
        FCM_BASE_URL: 'https://fcm.googleapis.com/fcm/send',
        TITLE: "RR MART - OTP",
        MESSAGE_I: 'Never share your OTP with others. You are receiving this message to verify your account.',
        MESSAGE_II: 'Your verification OTP is',
        STATUS_NOTIFICATION: {
            NEW_ORDER: {
                TITLE: 'VSSV-Mart:New order',
                MESSAGE_I: "Hi, You have received a new order from ",
                MESSAGE_II: "Please check your orders list."
            },
            ORDER_ACCEPTED: {
                TITLE: 'VSSV-Mart:Order Accepted',
                MESSAGE_I: "Hi, ",
                MESSAGE_II: "Your items are being pic"
            },
            ORDER_REJECTED: {
                TITLE: 'VSSV-Mart:Order Rejected',
                MESSAGE_I: "Hi, ",
                MESSAGE_II: "Your order is rejected. Thank you!"
            },
            ORDER_PICKING: {
                TITLE: 'VSSV-Mart:Picking Started',
                MESSAGE_I: "Hi, ",
                MESSAGE_II: "Picking started."
            },
            PICKING_COMPLETED: {
                TITLE: 'VSSV-Mart:Picking completed',
                MESSAGE_I: "Hi, ",
                MESSAGE_II: "We have completed the picking of the items from your order list. We will contact you soon for further updates. Thank you!"
            },
            OUT_FOR_DELIVERY: {
                TITLE: 'VSSV-Mart:Out for Delivery',
                MESSAGE_I: "Hi, ",
                MESSAGE_II: "your order is out for delivery. We will contact you soon for any assistances required. Thank you!"
            },
            ORDER_DELIVERED: {
                TITLE: 'VSSV-Mart:Order Delivered',
                MESSAGE_I: "Hi, ",
                MESSAGE_II: "your order is delivered successfully! Thank you for using VSSV Mart. We are happy to serve you. Thank You!"
            }
        },
    },
    STATUS: {
        PR: "Processing",
        CN: "Confirmed",
        RJ: "Rejected",
        RC: "Received",
        PL: "Picking Items",
        PC: "Picking Completed",
        DP: "Order Dispatched",
        DL: "Order Delivered",
        REMARKS: {
            OPR: "We are processing your order. We will confirm your order soon.",
            OCN: "Your order has been confirmed. Sit tight!, we will contact you soon for further instructions.",
            ORJ: "Sorry! Your order has been rejected. Rejection is due to ",
            ORC: "Thank you for ordering! We have received your picklist.",
            OPL: "We are picking your items. We will let you know once we complete your picklist. Thank you.",
            OPC: "We have completed picking your order items. Details of the fulfillment will be shared with you soon. Thank you.",
            ODP: "Your order has been dispatched. It will be delivered to you soon. Thank you.",
            ODL: "Your order got delivered successfully.",
            PLPR: "We are checking this picklist item.",
            PLCN: "Picklist item confirmed.",
            PLRJ: "Sorry! This picklist item was rejected. Rejection is due to ",
            PLRC: "Picklist received. We are checking for it's availability.",
            PLPL: "This item is being picked.",
            PLPC: "We have picked this item.",
        }
    }
}

module.exports = constants;