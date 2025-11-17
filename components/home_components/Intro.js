import { motion } from "framer-motion";
import Image from "next/image";
import { shimmer, toBase64 } from "../../shared/utils/imgPlaceholder";
import Link from "next/link";
import { bannerImages } from "../../shared/json";
import { useGlobalContext } from "../../Contexts/globalContext/context";

export default function Intro() {
  const { translate: t } = useGlobalContext();

  return (
    <div className="text-secondary relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative h-screen flex items-center justify-center"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>

        {/* Black Hat Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10"
        >
          <Image
            layout="intrinsic"
            width={400}
            height={400}
            priority
            src="/black-hat.png"
            className="object-contain drop-shadow-2xl"
            alt="Minimalist Black Hat"
          />
        </motion.div>

        {/* Moto Text */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-32 left-0 right-0 text-center z-20"
        >
          <p className="text-xl md:text-2xl font-light tracking-wider">
            {t('moto1')}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-secondary/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-secondary/50 rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Second Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-[50vh] flex items-center justify-center bg-gradient-to-b from-secondary to-third"
      >
        <div className="text-center">
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4"
          >
            {t("moto2")}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-24 h-0.5 bg-accent mx-auto"
          ></motion.div>
        </div>
      </motion.div>

      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-third py-16 overflow-hidden"
      >
        <div className="relative">
          <motion.div
            animate={{ x: [0, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex space-x-8"
          >
            {bannerImages.concat(bannerImages).map((item, i) => (
              <Link key={i} href={`/product/${item.name.replace(/\s/g, "_")}?cat=${item.cat}`}>
                <a className="flex-shrink-0 group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-72 h-72 relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                  >
                    <Image
                      width={288}
                      height={288}
                      src={item.url}
                      alt={item.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
                </a>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
