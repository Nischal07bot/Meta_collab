// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { SocketProvider } from "./Context/Socketprovide.jsx";
import { UserProvider } from "./Context/userContext.jsx";
import { RoomProvider } from "./Context/roomContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>  
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
          <RoomProvider>
            <App />
          </RoomProvider>
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);
