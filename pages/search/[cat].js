//hooks
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../Contexts/globalContext/context";
// components
import GridProducts from "../../components/product_components/GridProducts";
import SideCategories from "../../components/category_components/SideCategories";
import SortItems from "../../components/category_components/SortItems";
// values, icons, etc...
import { server } from "../../config";
import { TagIcon, FilterIcon, ShoppingBagIcon } from "@heroicons/react/outline";

export default function cats({ products, allCategories, category }) {
  const router = useRouter();
  const { sorter, sort } = useGlobalContext();
  // to update when category change
  const [currentCat, setCurrentCat] = useState(category);
  // contains products to show
  const [proSt, setProSt] = useState([...products]);

  //trigger when cat param change
  useEffect(() => {
    if (currentCat !== router.query.cat) {
      setCurrentCat(router.query.cat);
      const resArr = sorter(products);
      setProSt([...resArr]);
    }
  }, [router.query.cat]);

  // trigger when sort view change
  useEffect(() => {
    const resArr = sorter(products);
    setProSt([...resArr]);
  }, [sort]);

  return (
    <>
      {/* as a cover behind navbar */}
      <div className="fixed w-full py-10 top-0 bg-secondary glob-trans z-30"></div>
      {/* search page */}
      <div className="bg-secondary text-secondary glob-trans min-h-screen">
        {/* Header Section */}
        <div className="pt-36 sm:pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4 shadow-lg">
                <TagIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-primary mb-2 capitalize">
                {category.replace(/-/g, ' ')} Collection
              </h1>
              <p className="text-secondary text-lg">
                {proSt.length > 0
                  ? `Explore ${proSt.length} product${proSt.length === 1 ? '' : 's'} in this category`
                  : "No products available in this category"}
              </p>
            </div>

            {/* Category Stats */}
            {proSt.length > 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-third rounded-xl shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <TagIcon className="w-5 h-5 mr-2 text-accent" />
                      <span className="text-primary font-medium capitalize">{category.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingBagIcon className="w-5 h-5 mr-2 text-accent" />
                      <span className="text-primary font-medium">{proSt.length} Products</span>
                    </div>
                    <div className="flex items-center">
                      <FilterIcon className="w-5 h-5 mr-2 text-secondary" />
                      <span className="text-secondary">Filtered & Sorted</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row relative">
          {/* selecting categories */}
          <SideCategories categories={allCategories} />
          {/* showing result for search */}
          <div className="w-[85%] sm:w-[66%] mx-auto">
            {proSt.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <TagIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-2">No Products Found</h3>
                <p className="text-secondary mb-6 max-w-md mx-auto">
                  This category doesn't have any products yet. Check out our other categories or browse all products.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/search')}
                    className="bg-accent hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Browse All Products
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="bg-third hover:bg-gray-50 text-primary px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-200"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
            <GridProducts
              key={proSt[0] != undefined ? proSt[0]["name"] : "nothing"}
              products={proSt}
              limit={100}
            />
          </div>
          {/* set sort view of search results */}
          <SortItems />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(cnx) {
  const category = cnx.params.cat;
  const productsData = await fetch(
    `${server}/api/product/crud?filter=category&value=${category}`,
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

  const products = await productsData.json();
  const allCategories = await catsData.json();

  return {
    props: {
      products,
      allCategories,
      category,
    },
    // revalidate: 900, //every 15 minutes
  };
}
// export async function getStaticPaths() {
//   const catsData = await fetch(`${server}/api/product/categories`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const cats = await catsData.json();

//   // Get the paths we want to pre-render based on posts
//   const paths = cats.map((cat) => ({
//     params: { cat },
//   }));
//   // We'll pre-render only these paths at build time.
//   // { fallback: blocking } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: "blocking" };
// }
