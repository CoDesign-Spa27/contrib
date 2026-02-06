"use client";

import { motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <DotLottieReact
        src="https://lottie.host/4a53cb34-9138-400f-8066-603c6e38ebae/hE5oJJ7eaD.lottie"
        loop
        className="w-24 h-24"
        autoplay
      />
    </motion.div>
  );
}
