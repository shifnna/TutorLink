import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-[#0E1016]
        overflow-hidden
      "
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="
            absolute
            top-[-15%]
            right-[-10%]
            w-[45vmax]
            h-[45vmax]
            rounded-full
            opacity-20
            blur-3xl
          "
          style={{
            background:
              "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)",
          }}
        />

        <div
          className="
            absolute
            bottom-[-15%]
            left-[-10%]
            w-[40vmax]
            h-[40vmax]
            rounded-full
            opacity-20
            blur-3xl
          "
          style={{
            background:
              "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo container */}
        <motion.div
          animate={{
            rotate: [0, -8, 8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            relative
            w-[76px]
            h-[76px]
            rounded-[22px]
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-[#7C9CFF]
            to-[#C08BFA]
            shadow-[0_0_40px_rgba(124,156,255,0.25)]
          "
        >
          <FaGraduationCap className="text-[#0E1016] w-9 h-9" />

          {/* Small rotating glow ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-[-7px]
              rounded-[27px]
              border
              border-[#7C9CFF]/20
            "
          />
        </motion.div>

        {/* TutorLink text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="
            text-[24px]
            font-semibold
            tracking-tight
          "
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
        </motion.div>

        {/* Loading dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.15,
                ease: "easeInOut",
              }}
              className="
                w-1.5
                h-1.5
                rounded-full
                bg-[#A78BFA]
              "
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PageLoader;