import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const isDark = theme === "dark" || (theme === "system" && prefersDark);

  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    applyTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("ThemeProvider missing.");
  }

  return ctx;
}




