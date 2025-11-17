import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "../../shared/utils/imgPlaceholder";
import { HeartIcon, StarIcon, ShoppingBagIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";

export default function GridProducts({ products, limit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products?.map((product, i) => {
        if (i >= limit) return;
        return (
          <Link key={i} href={`/product/${product.name}?cat=${product.category}`} passHref>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                opacity: { ease: "easeOut", duration: 0.6 },
                y: { ease: "easeOut", duration: 0.6 },
                scale: { ease: "easeIn", duration: 0.2 },
              }}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer relative"
            >
              {/* Image Container */}
              <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {product.store[0]?.imgUrls?.[0] ? (
                  <Image
                    alt={product.name}
                    src={product.store[0].imgUrls[0]}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg"
                >
                  <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                </motion.button>

                {/* Quick Add to Cart */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-accent/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent shadow-lg"
                >
                  <ShoppingBagIcon className="w-5 h-5 text-white" />
                </motion.button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.sale && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                    >
                      SALE
                    </motion.div>
                  )}
                  {product.newArival && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                    >
                      NEW
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                  {product.category?.replace(/-/g, ' ')}
                </p>

                {/* Product Name */}
                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                  {product.name.replace(/_/g, " ")}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`w-4 h-4 ${
                          index < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">(4.2)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className={`text-xs font-medium ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                      {product.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-accent hover:bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:shadow-lg shadow-md"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  );
}
