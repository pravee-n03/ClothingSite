
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
import { SearchIcon, FilterIcon, ShoppingBagIcon } from "@heroicons/react/outline";

export default function index({ products, allCategories }) {
  const router = useRouter();
  const { sorter, sort } = useGlobalContext();
  // to update page when search query change
  const [currentQ, setCurrentQ] = useState(router.query.q);
  // contains products to show
  const [proSt, setProSt] = useState(Array.isArray(products) ? [...products] : []);

  // trigger when search query change
  useEffect(() => {
    if (currentQ !== router.query.q) {
      setCurrentQ(router.query.q);
      const resArr = sorter(products && Array.isArray(products) ? products : []);
      setProSt([...resArr]);
    }
  }, [router.query.q]);

  // trigger when sort view change
  useEffect(() => {
    const resArr = sorter(products && Array.isArray(products) ? products : []);
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
                <SearchIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                {router.query.q ? `Search Results for "${router.query.q}"` : "All Products"}
              </h1>
              <p className="text-secondary text-lg">
                {proSt.length > 0
                  ? `Found ${proSt.length} product${proSt.length === 1 ? '' : 's'}`
                  : "No products found matching your search"}
              </p>
            </div>

            {/* Search Stats */}
            {proSt.length > 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-third rounded-xl shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-6 text-sm">
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
                  <SearchIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-2">No Results Found</h3>
                <p className="text-secondary mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your search. Try adjusting your search terms or browse our categories.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-accent hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Browse All Products
                </button>
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
  const query = cnx.query?.q;
  const data = await fetch(
    `${server}/api/product/crud?filter=name&value=${query}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const rewCats = await fetch(`${server}/api/product/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const products = await data.json();
  const allCategories = await rewCats.json();

  return {
    props: { products, allCategories },
  };
}
