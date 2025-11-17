import React from "react";
// product images component
import ImageSelectore from "./ImagesSecelctor";
// selece color size and add to cart component
import ColorSizeSelector from "./ColorSizeSelector";

function SingleProduct({ product }) {
  const { name, price, store, description } = product;

  // take out all image urls from store and push into images[]
  var images = [];
  store.forEach((color) => {
    color["imgUrls"].forEach((url) => images.push(url));
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ImageSelectore name={name} price={price} images={images} />
          </div>

          {/* Product Details Section */}
          <div className="lg:pt-8">
            <ColorSizeSelector
              store={store}
              description={description}
              name={name}
              price={price}
              img={images[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
