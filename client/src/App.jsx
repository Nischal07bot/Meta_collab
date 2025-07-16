import { Routes, Route } from "react-router-dom";
import LandingPage from "./screen/landing";
import GamePage from "./screen/game";
import Login from "./screen/login";
import Signup from  "./screen/signup"
import Roomcr from "./screen/Roomcr"
import Playerlist from "./screen/Lobby"
import UserAuth from "./Auth/userAuth"
function App() {  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<UserAuth><GamePage /></UserAuth>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/roomcr" element={<UserAuth><Roomcr /></UserAuth>} />
      <Route path="/lobby" element={<UserAuth><Playerlist /></UserAuth>} />
    </Routes>
  );
}

export default App;