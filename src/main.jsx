import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../homepage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
