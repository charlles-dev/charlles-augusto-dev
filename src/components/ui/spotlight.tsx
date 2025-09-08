import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Spotlight = ({
  className,
  fill,
}: {
  className?: string;
  fill?: string;
}) => {
  return (
    <motion.svg
      className={cn(
        "animate-pulse absolute pointer-events-none opacity-0 z-[1]",
        className
      )}
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 2,
      }}
    >
      <ellipse
        cx="256"
        cy="256"
        rx="256"
        ry="256"
        fill={`url(#spotlight)`}
      />
      <defs>
        <radialGradient
          id="spotlight"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop
            offset="0%"
            stopColor={fill || "hsl(158 64% 52%)"}
            stopOpacity="0.4"
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};