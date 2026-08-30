import { motion } from "framer-motion";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "rounded-3xl bg-white shadow-md border border-slate-200 p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}




