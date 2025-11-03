import { useEffect, useState } from "react";
import { XIcon, CheckIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import AcceptModal from "./AcceptModal";
const elm = (
  <div className={`min-w-[115px] bg-secondary text-primary rounded-full flex flex-row justify-between -mb-3 pb-0.5`}>
    <p className="pl-2">size</p>
    <p className="pr-2">amount</p>
  </div>
);

export default function AdminProduts({ product, index, setProducts, products }) {
  const { name, price, store, description, sale, newArival, available, _id } = product;
const router = useRouter();
// confirm delete State
const [confDelete, setConfDelete] = useState(false);
const [showModal, setShowModal] = useState(false);
useEffect(async () => {
  if (confDelete) {
    const res = await fetch("/api/product/crud", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id:_id}),
    });

    const athorized = res.headers.get("authorized") === "true";
      const data = await res.json();
      if(athorized){
        if (data.message=="deleted") {
          let newPros = products;
      newPros.splice(index,1);
      setProducts(newPros);
      alert("product deleted successfuly");
      window.location.reload(true);
    } else {
      alert("something went wrong try again later");
    }
    setConfDelete(false);
  }else{
    router.push("/admin/login");
  }
  }
}, [confDelete])
  //for a smart responsive
  const [innerW, setInnerW] = useState(typeof window!=='undefined'?window.innerWidth:0);
  useEffect(() => {
    if(typeof window === "undefined")return
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  });
  const updateWidth = () => {
    setInnerW(window.innerWidth);
  };

  return (
    <div className="bg-secondary rounded-2xl shadow-xl p-6 border border-gray-200 my-6 mx-8">
      <AcceptModal
          showModal={showModal}
          setShowModal={setShowModal}
          setSave={setConfDelete}
        />

      {/* Header with actions */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-primary mb-2">{name.replace(/_/g, " ")}</h3>
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold text-accent">{price}₹</span>
            <div className="flex gap-2">
              {sale && <span className="px-2 py-1 bg-alert text-white text-xs rounded-full">On Sale</span>}
              {newArival && <span className="px-2 py-1 bg-success text-white text-xs rounded-full">New</span>}
              {available ? <span className="px-2 py-1 bg-approve text-white text-xs rounded-full">Available</span> : <span className="px-2 py-1 bg-danger text-white text-xs rounded-full">Unavailable</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="p-2 text-primary hover:text-accent transition-colors duration-200 rounded-lg hover:bg-third"
            onClick={()=>router.push(`/admin/product/edit/${_id}`)}
            title="Edit Product"
          >
            <PencilAltIcon className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-primary hover:text-danger transition-colors duration-200 rounded-lg hover:bg-third"
            onClick={()=>setShowModal(true)}
            title="Delete Product"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Variants */}
      <div className="space-y-6">
        {store.map((miniStore, i) => {
          const { color, imgUrls, sizeAmnt } = miniStore;
          return (
            <div key={i} className="border border-gray-200 rounded-xl p-4 bg-third">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                ></div>
                <span className="font-medium text-primary capitalize">{color}</span>
              </div>

              {/* Size and Amount Grid */}
              {sizeAmnt.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-primary mb-3">Size & Stock</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sizeAmnt.map((val, idx) => (
                      <div
                        key={idx}
                        className="bg-primary rounded-lg p-3 text-center border border-gray-200"
                      >
                        <div className="text-sm font-medium text-primary">{val.size}</div>
                        <div className="text-xs text-secondary">Stock: {val.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {imgUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-primary mb-3">Product Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {imgUrls.map((url, imgIdx) => (
                      <div key={imgIdx} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={url}
                          alt={`${color} - ${imgIdx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Description */}
      {description && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-primary mb-2">Description</h4>
          <p className="text-secondary text-sm leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}
