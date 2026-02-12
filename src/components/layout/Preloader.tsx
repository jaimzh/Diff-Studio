import { useState, useEffect } from "react";
import { motion } from "motion/react";


export const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] text-white"
    >
      <div className="relative flex flex-col items-center ">
       
        <div className="text-center space-y-2 z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold tracking-[0.2em] uppercase"
          >
            Diff Studio
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.4 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] uppercase tracking-[0.4em] font-medium"
          >
            Initializing
          </motion.p>
        </div>
        <div className="mt-8 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative z-10">
          <motion.div
            className="absolute left-0 top-0 h-full bg-white/40"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Loading Percentage Text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="mt-4 text-[10px] font-mono tabular-nums"
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </motion.div>
  );
};
