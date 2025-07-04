import { Routes, Route } from "react-router-dom";
import LandingPage from "./screen/landing";
import GamePage from "./screen/game";
import Login from "./screen/login";
import Signup from  "./screen/signup"
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;