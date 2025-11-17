import { useState, useEffect } from "react";
import { useGlobalContext } from "../../Contexts/globalContext/context";
//icons
import {
    CheckIcon,
    HeartIcon,
    ShareIcon,
    TruckIcon,
    ShieldCheckIcon,
    RefreshIcon
  } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";

export default function ColorSizeSelector({store, description, name,price,img}){

  const { translate: t, addItem, cartToggler, theme } = useGlobalContext();

     // Product & Cart State
  const [color, setColor] = useState(store[0]["color"]);
  const [colorCode, setColorCode] = useState(store[0]["colorCode"]);
  const [size, setSize] = useState(store[0]["sizeAmnt"][0]["size"]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setColor(store[0]["color"]);
    setSize(store[0]["sizeAmnt"][0]["size"]);
  }, [store]);

  // UI States
  const [readMore, setReadMore] = useState(false);

  // Get available sizes for selected color
  const getAvailableSizes = () => {
    const selectedColorData = store.find(item => item.color === color);
    return selectedColorData ? selectedColorData.sizeAmnt.filter(sizeItem => sizeItem.amount > 0) : [];
  };

  const availableSizes = getAvailableSizes();

    return(
        <div className="space-y-6">
          {/* Product Title and Price */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 capitalize">
              {name.replace(/_/g, " ")}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-gray-900">₹{price}</span>
              <span className="text-lg text-gray-500 line-through">₹{Math.round(price * 1.2)}</span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">20% OFF</span>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.2) • 1,234 reviews</span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-semibold text-primary uppercase tracking-wide">{t('color')}</h4>
            <div className="flex flex-wrap gap-3">
              {store.map((item) => (
                <button
                  key={item.color}
                  onClick={() => {
                    setColor(item.color);
                    setColorCode(item.colorCode);
                  }}
                  className={`group relative w-14 h-14 rounded-full border-2 transition-all duration-200 ${
                    item.color === color
                      ? 'border-accent scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: item.colorCode || '#f3f4f6',
                  }}
                  title={item.color}
                >
                  {item.color === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckIcon className={`w-6 h-6 ${item.color === 'white' ? 'text-black' : 'text-white'}`} />
                    </div>
                  )}
                  <span className="sr-only">{item.color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {store[0]["sizeAmnt"][0]["size"] && (
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-semibold text-primary uppercase tracking-wide">{t('size')}</h4>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((sizeItem, i) => (
                  <button
                    key={i}
                    onClick={() => setSize(sizeItem.size)}
                    className={`w-14 h-14 rounded-lg border-2 font-semibold transition-all duration-200 ${
                      sizeItem.size === size
                        ? 'border-accent bg-accent text-white scale-105'
                        : 'border-gray-300 text-primary hover:border-accent hover:scale-105'
                    }`}
                  >
                    {sizeItem.size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Selected: <span className="font-medium">{size}</span>
              </p>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-semibold text-primary uppercase tracking-wide">Quantity</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {availableSizes.find(s => s.size === size)?.amount || 0} available
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <TruckIcon className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-primary">Free Delivery</p>
                <p className="text-xs text-gray-600">Within 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <RefreshIcon className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-primary">Easy Returns</p>
                <p className="text-xs text-gray-600">30 days policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-primary">Secure Payment</p>
                <p className="text-xs text-gray-600">100% protected</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h4 className="mb-4 text-lg font-semibold text-primary uppercase tracking-wide">Description</h4>
            <div className={`relative ${readMore ? '' : 'max-h-24 overflow-hidden'}`}>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
            <button
              onClick={() => setReadMore(!readMore)}
              className="text-accent hover:text-accent/80 font-medium mt-2 transition-colors"
            >
              {readMore ? 'Read Less' : 'Read More'}
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              addItem({
                name,
                price,
                amount: quantity,
                color,
                colorCode,
                size,
                image: img,
              });
              cartToggler();
            }}
            className="w-full bg-accent hover:bg-green-600 text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
          >
            Add to Cart - ₹{price * quantity}
          </button>

          {/* Buy Now Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Buy Now
          </button>
        </div>
    )
}
