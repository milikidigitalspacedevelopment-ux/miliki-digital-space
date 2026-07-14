import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import AuthProvider from "./context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/dashboard.css";

//console.log("[dev] src/main.jsx executed");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Root element with id="root" was not found.'
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);