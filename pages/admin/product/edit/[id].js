import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TableKinds from "../../../../components/admin/TableKinds";
import AcceptModal from "../../../../components/admin/AcceptModal";
import { server } from "../../../../config";
import authHandler from "../../../../shared/utils/auth/authHandler";

function edit({ id, product, allCategories }) {
  const router = useRouter();
  const {
    name,
    category,
    price,
    store,
    description,
    sale,
    newArival,
    available,
  } = product;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(newArival);
  //states for different kinds of a product diffrent colors sizes and amounts
  const [storeSt, setStoreSt] = useState(store);
  // category State
  const [catSt, setCatSt] = useState(category);
  // final product
  const [save, setSave] = useState(false);
  const [finalPro, setFinalPro] = useState(product);

  // modal state
  const [showModal, setShowModal] = useState(false);

  // fetch data just after click on save  button
  useEffect(async () => {
    if (save) {
      const res = await fetch("/api/product/crud", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPro),
      });

      const athorized = res.headers.get("authorized") === "true";
      const data = await res.json();

      if (athorized) {
        if (data.message == "updated") {
          alert("changes saved successfuly");
        router.back();
      } else {
        alert("something went wrong try again later");
      }
      setSave(false);
    }else{
      router.push("/admin/login");
    }
  }
  }, [save]);

  const submitHandler = (form) => {
    // make a product model to send
    const { name, category, price, description, sale, newArival, available } =
      form;

    const newName = name.replace(/ /g, "_");
    const newProduct = {
      id,
      name: newName,
      category,
      price,
      store: storeSt,
      description,
      sale,
      newArival,
      available,
    };
    setFinalPro(newProduct);
  };

  return (
    <div className="bg-primary min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-secondary rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Edit Product</h1>
            <p className="text-secondary">Update product information and variants</p>
          </div>

          <form
            className="space-y-8"
            onSubmit={handleSubmit(submitHandler)}
          >
            {/* modal for saving new store */}
            <AcceptModal
              showModal={showModal}
              setShowModal={setShowModal}
              setSave={setSave}
            />

            {/* Basic Information Section */}
            <div className="bg-third rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">1</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Product Name
                  </label>
                  <input
                    className="w-full bg-primary border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    type="text"
                    placeholder="Enter product name..."
                    defaultValue={name.replace(/_/g, " ")}
                    {...register("name", {
                      required: true,
                      pattern:
                        /^[^+={}()<>!@#$%^&*?;:,|\\/_.]*[^\s+={}()<>!@#$%^&*?;:,|\\/_.]$/,
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.type === "required"
                        ? "Product name is required"
                        : "Name should not end with whitespace or contain special characters"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Category
                  </label>
                  <select
                    className="w-full bg-primary border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    name="category"
                    onChange={(e) => {
                      setCatSt(e.target.value);
                    }}
                    {...register("category", { required: true })}
                  >
                    {allCategories?.map((cat, i) => (
                      <option key={i} value={cat} selected={cat === catSt ? true : false}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">Please select a category</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Price (₹)
                  </label>
                  <input
                    className="w-full bg-primary border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    type="number"
                    placeholder="0.00"
                    defaultValue={price}
                    {...register("price", { required: true })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">Price is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Variants Section */}
            <div className="bg-third rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">2</span>
                Product Variants
              </h2>
              <div className="space-y-6">
                {storeSt?.map((kind, i) => {
                  return (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <TableKinds
                        key={i}
                        i={i}
                        register={register}
                        errors={errors}
                        storeSt={storeSt}
                        setStoreSt={setStoreSt}
                      />
                    </div>
                  );
                })}

                {/* Add/Remove Color Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    className="flex items-center justify-center px-6 py-3 bg-accent hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    onClick={() => {
                      setStoreSt([
                        ...storeSt,
                        {
                          color: "",
                          colorCode: "",
                          sizeAmnt: [{ size: "", amount: 0 }],
                          imgUrls: [],
                        },
                      ]);
                    }}
                  >
                    <span>Add New Color Variant</span>
                  </button>
                  {storeSt.length > 1 && (
                    <button
                      type="button"
                      className="flex items-center justify-center px-6 py-3 bg-danger hover:bg-red-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      onClick={() => {
                        let tempObj = storeSt;
                        tempObj.pop();
                        setStoreSt([...tempObj]);
                      }}
                    >
                      <span>Remove Last Color</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-third rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">3</span>
                Description
              </h2>
              <div>
                <textarea
                  className="w-full h-40 bg-primary border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none resize-none"
                  type="text"
                  defaultValue={description}
                  placeholder="Describe your product..."
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">Description is required</p>
                )}
              </div>
            </div>

            {/* Product Status Section */}
            <div className="bg-third rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold mr-3">4</span>
                Product Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-accent bg-primary border-gray-300 rounded focus:ring-accent focus:ring-2"
                    type="checkbox"
                    {...register("sale")}
                    defaultChecked={sale}
                  />
                  <label className="ml-3 text-sm font-medium text-primary">On Sale</label>
                </div>
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-accent bg-primary border-gray-300 rounded focus:ring-accent focus:ring-2"
                    type="checkbox"
                    {...register("newArival")}
                    defaultChecked={newArival}
                  />
                  <label className="ml-3 text-sm font-medium text-primary">New Arrival</label>
                </div>
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-accent bg-primary border-gray-300 rounded focus:ring-accent focus:ring-2"
                    type="checkbox"
                    {...register("available")}
                    defaultChecked={available}
                  />
                  <label className="ml-3 text-sm font-medium text-primary">Available</label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                className="px-8 py-4 bg-accent hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold text-lg"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default edit;

export async function getServerSideProps(context) {
  const { authorized } = await authHandler(context.req, context.res, true);
  if (authorized) {
    const id = context.params.id;
    const productData = await fetch(`${server}/api/product/crud?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const catsData = await fetch(`${server}/api/product/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const product = await productData.json();
    const allCategories = await catsData.json();

    return { props: { id, product, allCategories } };
  } else {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
}
