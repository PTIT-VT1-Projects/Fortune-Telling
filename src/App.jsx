import "./App.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

import Features from "./pages/features/Features";
import Games from "./pages/games";
import Header from "./layouts/Header";
import FaceReading from "./pages/games/face-reading/index";
import EmotionArena from "./pages/games/emotion-arena";
import Footer from "./layouts/Footer";

function App() {
  return (
    <Router>
      <div className="app" id="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/games">
                <Route path="face-reading" element={<FaceReading />}></Route>
                <Route path="emotion-arena" element={<EmotionArena />}></Route>
                <Route path="" index element={<Games />} />
              </Route>
              <Route path="/features" element={<Features />} />
              <Route path="/" element={<Navigate to="/games" replace />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
