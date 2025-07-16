// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { SocketProvider } from "./Context/Socketprovide.jsx";
import { UserProvider } from "./Context/userContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>  
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);
