import { motion } from "framer-motion";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-transparent p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="aspect-square rounded-2xl glass-card"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--accent-glow)" : "var(--bg-glass)",
              }}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
