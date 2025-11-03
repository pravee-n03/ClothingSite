import { server } from "../../../config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminProduts from "../../../components/admin/AdminProduts";
import authHandler from "../../../shared/utils/auth/authHandler";

export default function cats({ allProducts, allCategories, query }) {
  const [products, setProducts] = useState(allProducts);
  //pushing query whene category change
  useEffect(async () => {
    setProducts(allProducts);
  }, [query]);

  const router = useRouter();
  const queryHandler = (cat) => {
    const params = new URLSearchParams();
    params.append("cat", cat);
    router.push({ search: params.toString() });
  };

  return (
    <div className="bg-primary min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Product Management</h1>
          <div className="bg-secondary rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Filter by Category
                </label>
                <select
                  className="bg-primary border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none min-w-[200px]"
                  name="categories"
                  onChange={(e) => {
                    queryHandler(e.target.value);
                  }}
                >
                  {allCategories.map((cat, i) => (
                    <option key={i} value={cat} selected={cat === query ? true : false}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-secondary">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="space-y-6">
            {products.map((product, i) => {
              return (
                <AdminProduts
                  key={product._id}
                  product={product}
                  index={i}
                  setProducts={setProducts}
                  products={products}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-secondary rounded-xl p-12 border border-gray-200 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-primary mb-2">No Products Found</h3>
            <p className="text-secondary mb-6">There are no products in this category yet.</p>
            <button
              onClick={() => router.push('/admin/product/create')}
              className="px-6 py-3 bg-accent hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
            >
              Create New Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { authorized } = await authHandler(
    context.req,
    context.res,
    true
  );

  if (authorized) {
    const query = context.params.cat;
    const productsData = await fetch(
      `${server}/api/product/crud?cat=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const catsData = await fetch(`${server}/api/product/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const allProducts = await productsData.json();
    const allCategories = await catsData.json();

    return {
      props: { allProducts, allCategories, query },
    };
  } else {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
}
