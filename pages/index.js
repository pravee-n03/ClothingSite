import { server } from "../config";
import Intro from "../components/home_components/Intro";
import { motion } from "framer-motion";
import GridProducts from "../components/product_components/GridProducts";
import Moto1 from "../components/home_components/Moto1";
import Link from "next/link";
import { useGlobalContext } from "../Contexts/globalContext/context";
import { ArrowRightIcon } from "@heroicons/react/outline";

export default function Home({ newArivals, sales }) {
  const { translate } = useGlobalContext();

  return (
    <div className="bg-secondary min-h-screen">
      <Intro />

      {/* Latest Arrivals Section */}
      {newArivals.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-b from-secondary to-third"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {translate("latest_arivals")}
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Discover our newest arrivals, carefully curated for the modern minimalist
              </p>
            </motion.div>
            <GridProducts products={newArivals} limit={6} />
          </div>
        </motion.section>
      )}

      {/* Moto1 Section */}
      <Moto1 />

      {/* Sales Section */}
      {sales.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-b from-third to-secondary"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {translate("sales")}
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Limited time offers on premium quality products. Don't miss out!
              </p>
            </motion.div>
            <GridProducts products={sales} limit={6} />
          </div>
        </motion.section>
      )}

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-primary text-secondary"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Explore More?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg mb-8 opacity-90"
          >
            Browse our complete collection of minimalist products designed for the modern lifestyle
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/search">
              <a className="inline-flex items-center px-8 py-4 bg-accent hover:bg-green-600 text-white text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg group">
                {translate("View_Products")}
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export async function getServerSideProps() {
  const newArivals = await getProductsFromDB("newArival", true);
  const sales = await getProductsFromDB("sale", true);
  return {
    props: {
      newArivals,
      sales,
    },
    // revalidate: 900, //every 15 minutes
  };
}

async function getProductsFromDB(prop, value) {
  const data = await fetch(
    `${server}/api/product/crud?filter=${prop}&value=${value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await data.json();
}
