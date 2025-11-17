import { useGlobalContext } from "../Contexts/globalContext/context";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import TableOrder from "../components/product_components/TableOrder";
import { langs } from "../Contexts/values/LangValues";
import { useEffect } from "react";
import Script from "next/script";
import {
  LocationMarkerIcon,
  TruckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserIcon,
  PhoneIcon,
  HomeIcon
} from "@heroicons/react/outline";

export default function checkout() {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    translate: t,
    lang,
    cart,
    total,
    amount,
    clearCart,
    account,
  } = useGlobalContext();
  const [orders, setOrders] = useState({
    name: "",
    lastname: "",
    address: "",
    phone: 0,
    cart,
    amount,
    cost: total,
  });
  const [send, setSend] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // set new order to sent
  const submitHandler = async (form) => {
    setPaymentLoading(true);
    console.log('Key ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    console.log('Amount:', total);
    try {
      // Create Razorpay order
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total }),
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        alert('Failed to create payment order: ' + errorText);
        setPaymentLoading(false);
        return;
      }
      const orderData = await response.json();
      console.log('Order data:', orderData);

      if (!response.ok) {
        alert('Failed to create payment order');
        setPaymentLoading(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NextOmmerce',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async function (response) {
          // Payment successful
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // make a product model to send
          const { name, lastname, address, phone } = form;
          const newOrder = {
            name,
            lastname,
            address,
            phone,
            cart,
            cost: total,
            amount,
            payment_id: razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          };
          setOrders(newOrder);
          setSend(true);
        },
        prefill: {
          name: form.name,
          email: account.email || '',
          contact: form.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Payment failed. Please try again.');
    }
    setPaymentLoading(false);
  };

  //sending order
  const sendOrder = async () => {
    const data = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orders),
    });

    const res = await data.json();
    if (res.message && res.message === "saved") {
      clearCart();
      router.push("/");
      alert("your order submited successfuly");
    } else {
      if (res.message === "incomplete data") {
        alert("Please complete all fileds in the form");
      } else {
        alert("something went wrong! Try again moments later.");
      }
    }
  };

  useEffect(()=>{
    if(account.name){
      setValue("name", account.name);
      setValue("lastname", account.lastname);
      setValue("address", account.address);
      setValue("phone", account.phone);
      document.getElementById("name").value = account.name;
      document.getElementById("lastname").value = account.lastname;
      document.getElementById("address").value = account.address;
      document.getElementById("phone").value = account.phone;
    }
  })

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div
        style={{ direction: `${lang === langs["fa"] ? "rtl" : "ltr"}` }}
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column - Delivery Information */}
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Complete your order by providing delivery details</p>
              </div>

              {/* Delivery Information Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <LocationMarkerIcon className="w-6 h-6 text-accent mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        First Name
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                        id="name"
                        type="text"
                        placeholder="Enter your first name"
                        {...register("name", {
                          required: true,
                          pattern: /^[^+={}()<>!@#$%^&*?;:,|\\/_.\d]*[^\s+={}()<>!@#$%^&*?;:,|\\/_.\d]$/,
                        })}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.name.type === "required"
                            ? "First name is required"
                            : "Invalid name format"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastname">
                        Last Name
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                        type="text"
                        id="lastname"
                        placeholder="Enter your last name"
                        {...register("lastname", {
                          required: true,
                          pattern: /^[^+={}()<>!@#$%^&*?;:,|\\/_.\d]*[^\s+={}()<>!@#$%^&*?;:,|\\/_.\d]$/,
                        })}
                      />
                      {errors.lastname && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.lastname.type === "required"
                            ? "Last name is required"
                            : "Invalid name format"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                      <PhoneIcon className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      {...register("phone", {
                        required: true,
                        pattern: /^\d+$/,
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.phone.type === "required"
                          ? "Phone number is required"
                          : "Invalid phone number"}
                      </p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                      <HomeIcon className="w-4 h-4 inline mr-1" />
                      Delivery Address
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
                      id="address"
                      rows="4"
                      placeholder="Enter your complete delivery address"
                      {...register("address", {
                        required: true,
                      })}
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">Delivery address is required</p>
                    )}
                  </div>

                  {/* Delivery Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <TruckIcon className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                        <p className="text-xs text-gray-600">3-5 days</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                        <p className="text-xs text-gray-600">100% protected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <CreditCardIcon className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                        <p className="text-xs text-gray-600">30 days policy</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">IMG</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name.replace(/_/g, " ")}</h3>
                        <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Qty: {item.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{(item.price * item.amount).toLocaleString()}</p>
                        <p className="text-xs text-gray-600">₹{item.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST 18%)</span>
                    <span className="font-medium">₹{Math.round(total * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{(total + Math.round(total * 0.18)).toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handleSubmit(submitHandler)}
                  disabled={paymentLoading}
                  className="w-full mt-6 bg-accent hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCardIcon className="w-5 h-5 mr-2" />
                      Pay Now - ₹{(total + Math.round(total * 0.18)).toLocaleString()}
                    </div>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  onClick={() => router.back()}
                  className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Confirmation Modal */}
        {send === true ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Your Order</h3>
              <p className="text-gray-600 mb-6">Please review your order details before confirming</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSend(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Review Order
                </button>
                <button
                  onClick={() => {
                    setSend(false);
                    sendOrder();
                  }}
                  className="flex-1 bg-accent hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
