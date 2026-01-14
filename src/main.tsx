import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/**
 * Regras:
 * - GitHub Pages (BASE_URL !== "/") → HashRouter
 * - Vercel / Local (BASE_URL === "/") → BrowserRouter
 */
const Router =
  import.meta.env.PROD && import.meta.env.BASE_URL !== "/"
    ? HashRouter
    : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
