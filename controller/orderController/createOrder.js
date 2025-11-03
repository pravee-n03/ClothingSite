import errorController from "../errorController";
import Order from "../../models/OrderModel";
import crypto from 'crypto';

export default async function createOrder(req, res) {
  const { name, lastname, address, phone, cart, cost, amount, payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (name && lastname && address && phone && cart && cost && amount && payment_id && razorpay_order_id && razorpay_signature) {
    try {
      // Verify payment signature
      const sign = razorpay_order_id + "|" + payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return errorController(400, "Payment verification failed", res);
      }

      // create new order
      const order = new Order({
        name,
        lastname,
        address,
        phone,
        cart,
        cost,
        amount,
        sent: false,
        payment_id,
        payment_status: 'paid',
      });
      const createdOrder = await order.save();
      return res.status(200).send({ message: "saved", createdOrder });
    } catch (error) {
      errorController(500, error, res);
    }
  } else {
    errorController(422, "incomplete data", res);
  }
}
