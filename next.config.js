const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public", // fix typo here
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    domains: ["demo.vercel.store", "cdn11.bigcommerce.com", "toodies.co", "res.cloudinary.com"], // use the exact domains from your images
  },
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  },
});
