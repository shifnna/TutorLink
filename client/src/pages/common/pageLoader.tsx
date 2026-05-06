import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{
            rotate: [0, -15, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-indigo-600 p-5 rounded-2xl shadow-xl shadow-indigo-200"
        >
          <FaGraduationCap className="text-white w-6 h-6" />
        </motion.div>

        {/* <h1 className="text-3xl font-extrabold text-slate-800">
          Tutor<span className="text-indigo-600">Link</span>
        </h1> */}
      </div>
    </motion.div>
  );
};

export default PageLoader;