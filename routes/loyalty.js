const express = require('express')
const router =  express.Router();
const {getCustomerDetails,createCustomer,authenticateLoyalityPointRedem,loyaltyPointRedemption,getPOSBillDetails,getCouponDetails,redeemCoupon,addCoupon,getBills} = require('../controller/loyalty')


router.post('/get-loyalty-customer-details',getCustomerDetails)
router.post('/create-customer',createCustomer)
router.post('/authenticate-loyaltypoint-redemption',authenticateLoyalityPointRedem)
router.post('/loyalty-point-redemption',loyaltyPointRedemption)
router.post('/pos-bill-details',getPOSBillDetails)
router.post('/get-coupon-details',getCouponDetails)
router.post('/redeem-coupon',redeemCoupon)
router.post('/add-coupon',addCoupon)
router.post('/get-bills',getBills)

module.exports = router;