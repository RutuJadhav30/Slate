import { browser } from "$app/environment";
import { writable } from "svelte/store";

const THEME_KEY = "queue-theme";

const getInitialTheme = () => {
  if (!browser) return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
};

export const themeStore = writable(getInitialTheme());

const applyTheme = (mode) => {
  if (!browser) return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

if (browser) {
  themeStore.subscribe((value) => {
    window.localStorage.setItem(THEME_KEY, value);
    applyTheme(value);
  });
}

export const toggleTheme = () => {
  themeStore.update((current) => {
    return current === "dark" ? "light" : "dark";
  });
};
