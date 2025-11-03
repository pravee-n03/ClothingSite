import Razorpay from 'razorpay';
import connectDB from '../../../middleware/db/mongodb';
import errorController from '../../../controller/errorController';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async (req, res) => {
  if (req.method !== 'POST') {
    return errorController(405, 'Method not allowed', res);
  }

  const { amount, currency = 'INR' } = req.body;

  console.log('Received amount:', amount);
  console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
  console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not set');

  if (!amount || amount <= 0) {
    return errorController(400, 'Invalid amount', res);
  }

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log('Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    errorController(500, 'Payment order creation failed', res);
  }
};

export default connectDB(createPaymentOrder);
