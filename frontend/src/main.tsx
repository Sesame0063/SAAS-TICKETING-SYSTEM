import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="dark"
      newestOnTop
      pauseOnHover
    />
  </>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);




