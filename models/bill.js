const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
    customer_name:{
        type:String,
    },
    customer_mobile:{
        type:String,
    },
    transaction_number:{
        type:String,
    },
    transaction_type:{
        type:String,
    },
    gross_amount:{
        type:String,
    },
    net_amount:{
        type:String,
    },
    order_time:{
        type:Date
    },
    items:{
        type:Array
    },
})

const Bill = mongoose.model('bills',billSchema)

module.exports = Bill