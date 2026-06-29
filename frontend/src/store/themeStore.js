import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);

    set({
      theme,
    });
  },

  toggleTheme: () =>
    set((state) => {
      const nextTheme =
        state.theme === "light"
          ? "dark"
          : "light";

      localStorage.setItem(
        "theme",
        nextTheme
      );

      return {
        theme: nextTheme,
      };
    }),
}));

export default useThemeStore;