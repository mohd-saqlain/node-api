const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    customer_mobile:{
        type:String,
    },
    coupon:{
        type:Object,
    }
});

const Coupon = mongoose.model('coupon',couponSchema);

module.exports = Coupon