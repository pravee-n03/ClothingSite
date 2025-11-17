import { useState, useEffect } from "react";
import Image from "next/image";
// image placeholder functions
import { shimmer, toBase64 } from "../../shared/utils/imgPlaceholder";
//icons
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/outline";

export default function ImageSelectore({ name, price, images }) {
  // indicate what index of images array is currently selected to show as big image
  const [imgIndex, setImgIndex] = useState(0);
  //set image index to 0 every time product change
  useEffect(() => {
    setImgIndex(0);
  }, [name]);

  return (
    <div className="space-y-4 group">
      {/* Main Product Image */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border">
        <div className="aspect-square relative">
          <Image
            src={images[imgIndex]}
            alt={name}
            width={600}
            height={600}
            className="object-contain w-full h-full"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(600, 600)
            )}`}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => {
                  if (imgIndex > 0) setImgIndex(imgIndex - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ArrowLeftIcon width={20} className="text-gray-700" />
              </button>
              <button
                onClick={() => {
                  if (imgIndex < images.length - 1) setImgIndex(imgIndex + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ArrowRightIcon width={20} className="text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                i === imgIndex
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                width={80}
                height={80}
                src={url}
                className="object-cover w-full h-full"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(80, 80)
                )}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
