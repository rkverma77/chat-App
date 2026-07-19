import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark",
  palette: localStorage.getItem("chat-palette") || "emerald",
  
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.className = theme;
    set({ theme });
  },

  setPalette: (palette) => {
    localStorage.setItem("chat-palette", palette);
    document.documentElement.setAttribute("data-palette", palette);
    set({ palette });
  },

  initTheme: () => {
    const theme = localStorage.getItem("chat-theme") || "dark";
    const palette = localStorage.getItem("chat-palette") || "emerald";
    document.documentElement.className = theme;
    document.documentElement.setAttribute("data-palette", palette);
    set({ theme, palette });
  },
}));
