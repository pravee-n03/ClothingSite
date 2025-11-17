import { motion } from "framer-motion";
import Word from "./Word";

const words = ["minimal", "&", "functional"];

export default function Moto1() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative py-32 px-4 text-primary bg-gradient-to-r from-primary via-primarycont to-primary overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Words */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="text-5xl md:text-7xl lg:text-8xl font-bold flex justify-center flex-wrap gap-x-8 gap-y-4 mb-8">
            {words.map((value, i) => (
              <Word key={i} txt={value} delay={i * 0.3} />
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl md:text-2xl text-secondary/80 font-light max-w-3xl mx-auto"
          >
            Where simplicity meets sophistication in every design
          </motion.p>
        </motion.div>

        {/* Scrolling Text */}
        <motion.div
          initial={{ x: "100%" }}
          whileInView={{ x: "-100%" }}
          viewport={{ once: true }}
          transition={{ duration: 20, ease: "linear" }}
          className="scrolly text-4xl md:text-6xl lg:text-7xl font-extrabold text-secondary/20 overflow-hidden whitespace-nowrap"
        >
          <span className="inline-block px-8">MINIMAL & FUNCTIONAL • </span>
          <span className="inline-block px-8">MINIMAL & FUNCTIONAL • </span>
          <span className="inline-block px-8">MINIMAL & FUNCTIONAL • </span>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-secondary/20"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-secondary/20"></div>
    </motion.div>
  );
}
