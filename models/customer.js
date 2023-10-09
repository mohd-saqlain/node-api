const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
    },
    email:{
        type:String,
    },
    city:{
        type:String,
    },
    dob:{
        type:String,
    },
    merchant_id:{
        type:String,
    },
    customer_key:{
        type:String,
    },
    loyalty_points:{
        type:Number,
        default:0,
    },
})

const Customer = mongoose.model('customer',customerSchema)

module.exports = Customer