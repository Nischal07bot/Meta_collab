import { Routes, Route } from "react-router-dom";
import LandingPage from "./screen/landing";
import GamePage from "./screen/game";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;