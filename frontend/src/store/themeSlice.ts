import { createSlice } from "@reduxjs/toolkit";

interface ThemeState{
  dark:boolean;
}

const initialState:ThemeState={
  dark:localStorage.getItem("theme")==="dark",
};

const themeSlice=createSlice({
  name:"theme",
  initialState,
  reducers:{
    toggleTheme(state){
      state.dark=!state.dark;

      if(state.dark){
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme","dark");
      }else{
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme","light");
      }
    },
  },
});

export const {toggleTheme}=themeSlice.actions;
export default themeSlice.reducer;
