import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "../../shared/utils/imgPlaceholder";
import { HeartIcon, StarIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";

export default function GridProducts({ products, limit }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-28">
      {products?.map((product, i) => {
        if (i >= limit) return;
        return (
          <Link key={i} href={`/product/${product.name}?cat=${product.category}`} passHref>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                opacity: { ease: "easeOut", duration: 0.6 },
                y: { ease: "easeOut", duration: 0.6 },
                scale: { ease: "easeIn", duration: 0.2 },
              }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full h-80 overflow-hidden bg-gray-50">
                {product.store[0]?.imgUrls?.[0] ? (
                  <Image
                    alt={product.name}
                    src={product.store[0].imgUrls[0]}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-500"
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

                {/* Favorite Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                  <HeartIcon className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Sale Badge */}
                {product.sale && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    SALE
                  </div>
                )}

                {/* New Badge */}
                {product.newArival && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {product.category?.replace(/-/g, ' ')}
                </p>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {product.name.replace(/_/g, " ")}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
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
                  <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="bg-accent hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Add to Cart
                  </button>
                </div>

                {/* Stock Status */}
                <div className="mt-3 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
