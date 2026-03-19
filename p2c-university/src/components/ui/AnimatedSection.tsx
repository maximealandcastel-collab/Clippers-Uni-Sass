import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0,
  direction = "up" 
}: AnimatedSectionProps) {
  
  const getInitialY = () => {
    if (direction === "up") return 40;
    if (direction === "down") return -40;
    return 0;
  };

  const getInitialX = () => {
    if (direction === "left") return 40;
    if (direction === "right") return -40;
    return 0;
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: getInitialY(),
        x: getInitialX()
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        x: 0
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1], 
        delay 
      }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}
