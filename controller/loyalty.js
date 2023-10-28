const Customer = require("../models/customer");
const Bill = require("../models/bill");
const Coupon = require("../models/coupon");

const getCustomerDetails = async (req, res) => {
  const { customer_key, merchant_id, customer_mobile, country_code } = req.body;
  try {
    const customerExist = await Customer.findOne({ mobile: customer_mobile });
    if (customerExist) {
      // const customerCoupons = await Coupon.find({ customer_mobile });
      // const coupons = customerCoupons.map(({ coupon }) => ({
      //   coupon_name: coupon.coupon_name,
      //   coupon_code: coupon.coupon_code,
      // }));
      // console.log(coupons)
      const { loyalty_points , coupons } = customerExist;
      const jsonResponse = {
        status_code: 200,
        response: {
          loyalty_points,
          coupons,
        },
      };
      res.json(jsonResponse);
    } else {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Cannot find customer for provided mobile number",
        },
      };
      res.json(jsonResponse);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createCustomer = async (req, res) => {
  const { customer, merchant_id, customer_key } = req.body;
  const { name, mobile, address, city, dob } = customer;
  try {
    const customerExists = await Customer.findOne({ mobile: mobile });
    if (customerExists) {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Customer already exists",
        },
      };
      res.json(jsonResponse);
    } else {
      const customer = new Customer({
        name,
        mobile,
        address,
        city,
        dob,
        merchant_id,
        customer_key,
        loyalty_points: 100,
        coupons: [
            {
              coupon_name: "10%OFF",
              coupon_code: "10OFF"
            }
          ]
      });
      const customerRegister = await customer.save();

      if (customerRegister) {
        const jsonResponse = {
          status_code: 200,
          response: {
            message: "Customer successsully captured.",
          },
        };
        res.json(jsonResponse);
      } else {
        const jsonResponse = {
          status_code: 400,
          response: {
            message: "Some problem occured",
          },
        };
        res.json(jsonResponse);
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const authenticateLoyalityPointRedem = async (req, res) => {
  const { customer_mobile, points } = req.body;
  try {
    const customerExists = await Customer.findOne({ mobile: customer_mobile });
    if (customerExists) {
      const { loyalty_points } = customerExists;
      if (loyalty_points > points) {
        const jsonResponse = {
          status_code: 200,
          response: {
            points_value: points,
            authentication: false,
          },
        };
        res.json(jsonResponse);
      } else {
        const jsonResponse = {
          status_code: 400,
          response: {
            message: "Customer does not have sufficient points",
          },
        };
        res.json(jsonResponse);
      }
    } else {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Customer doesn't exists",
        },
      };
      res.json(jsonResponse);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const loyaltyPointRedemption = async (req, res) => {
  const { customer_mobile, points } = req.body;
  try {
    const customerExists = await Customer.findOne({ mobile: customer_mobile });
    if (customerExists) {
      const { loyalty_points } = customerExists;
      if (loyalty_points > points) {
        const updatedPoints = loyalty_points - points;
        const updateStatus = await Customer.findOneAndUpdate(
          { mobile: customer_mobile },
          { loyalty_points: updatedPoints }
        );
        const jsonResponse = {
          status_code: 200,
          response: {
            points_value: points,
          },
        };
        res.json(jsonResponse);
      } else {
        const jsonResponse = {
          status_code: 400,
          response: {
            message: "Customer does not have sufficient points",
          },
        };
        res.json(jsonResponse);
      }
    } else {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Customer doesn't exists",
        },
      };
      res.json(jsonResponse);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPOSBillDetails = async (req, res) => {
  const { customer, transaction } = req.body;
  const { mobile, name } = customer;
  const { number, type, gross_amount, net_amount, order_time, items } =
    transaction;
  try {
    const userExists = await Customer.findOne({ mobile: mobile });
    if (!userExists) {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Customer doesn't exists",
        },
      };
      return res.json(jsonResponse);
    }
    const bill = new Bill({
      customer_mobile: mobile,
      customer_name: name,
      transaction_number: number,
      transaction_type: type,
      gross_amount,
      net_amount,
      order_time,
      items,
    });
    const billCreated = await bill.save();
    if (billCreated) {
      const jsonResponse = {
        status_code: 200,
        response: {
          message: "Bill successfully captured",
        },
      };
      res.json(jsonResponse);
    } else {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Unable to capture bill",
        },
      };
      res.json(jsonResponse);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCouponDetails = async (req, res) => {
  const { coupon_code, customer_mobile } = req.body;
  try {
    const userExists = await Customer.findOne({ mobile: customer_mobile });
    if (userExists) {
      const matchedCoupon = await Coupon.findOne({
        customer_mobile,
        "coupon.coupon_code": coupon_code,
      });

      if (matchedCoupon) {
        const { coupon } = matchedCoupon;
        const jsonResponse = {
          status_code: 200,
          response: {
            coupon,
          },
        };
        res.json(jsonResponse);
      } else {
        const jsonResponse = {
          status_code: 400,
          response: {
            message: "Invalid coupon code",
          },
        };
        res.json(jsonResponse);
      }
    } else {
      const jsonResponse = {
        status_code: 400,
        response: {
          message: "Customer doesn't exists",
        },
      };
      res.status(400).json(jsonResponse);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const redeemCoupon = async (req, res) => {
  const { customer_mobile, coupon_code } = req.body;
  try {
    const userExists = await Customer.findOne({ mobile: customer_mobile });
    if (!userExists) {
      return res.status(400).json({ message: "User doesn't exists" });
    }
    const redeemedCoupon = await Coupon.findOneAndRemove({
      customer_mobile,
      "coupon.coupon_code": coupon_code,
    });
    if (!redeemedCoupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }
    res.status(200).json({ message: "Coupon successfully redeemed." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addCoupon = async (req, res) => {
  const { customer_mobile, coupon } = req.body;
  const { coupon_name, coupon_code } = coupon;
  try {
    const userExists = await Customer.findOne({ mobile: customer_mobile });
    if (!userExists) {
      return res.status(400).json({ message: "User doesn't exists" });
    }
    const coupons = new Coupon({ customer_mobile, coupon });
    const createdCoupon = await coupons.save();
    if (createdCoupon) {
      res.status(200).json({ message: "Coupon successfully added" });
    } else {
      res.status(400).json({ message: "Not Addded" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBills = async (req, res) => {
  const { number } = req.body;
  const data = await Bill.find({ customer_mobile: number });
  res.status(200).json(data);
};

module.exports = {
  getCustomerDetails,
  createCustomer,
  authenticateLoyalityPointRedem,
  loyaltyPointRedemption,
  getPOSBillDetails,
  getCouponDetails,
  redeemCoupon,
  addCoupon,
  getBills,
};