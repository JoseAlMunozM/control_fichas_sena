import { THEME_STORAGE_KEY } from "@/constants";

const themeScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = storedTheme === "dark" || (storedTheme === null && prefersDark);

      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    } catch {}
  })();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
