import "./styles.css";
import { createRoot, type Container } from "react-dom/client";
import { App } from "./app";
import React from "react";

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root") as Container);
  root.render(
    <React.StrictMode>
       <App />
    </React.StrictMode>

  );
});