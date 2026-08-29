import { createSlice } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

const savedTheme =
  (localStorage.getItem("theme") as ThemeMode | null) ?? "light";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: savedTheme,
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
