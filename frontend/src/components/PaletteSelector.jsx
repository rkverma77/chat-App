import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const PALETTES = [
  { id: 'emerald', color: '#10b981' },
  { id: 'blue', color: '#3b82f6' },
  { id: 'rose', color: '#f43f5e' },
  { id: 'violet', color: '#8b5cf6' },
  { id: 'amber', color: '#f59e0b' },
];

const PaletteSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { palette, setPalette } = useThemeStore();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 p-3 rounded-2xl flex flex-col gap-3"
            style={{ 
              background: "var(--bg-glass)",
              border: "1px solid var(--border-color)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${palette === p.id ? 'ring-2 ring-white' : ''}`}
                style={{ 
                  backgroundColor: p.color,
                  boxShadow: palette === p.id ? `0 0 15px ${p.color}80` : 'var(--shadow-md)'
                }}
                aria-label={`Select ${p.id} palette`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{
          background: "var(--accent-primary)",
          color: "#ffffff",
          boxShadow: "var(--shadow-lg)"
        }}
        aria-label="Toggle palette selector"
      >
        {isOpen ? <X size={24} /> : <Palette size={24} />}
      </button>
    </div>
  );
};

export default PaletteSelector;
