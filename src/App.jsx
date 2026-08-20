import "./App.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

import Features from "./pages/features";
import Games from "./pages/games";
import Header from "./layouts/Header";
import FaceReading from "./pages/games/face-reading/index";
import EmotionArena from "./pages/games/emotion-arena";
import Footer from "./layouts/Footer";
import JobPrediction from "./pages/games/job-prediction";

function App() {
  return (
    <Router>
      {console.log(
        "KEY LOADED:",
        import.meta.env.VITE_GEMINI_API_KEY
          ? import.meta.env.VITE_GEMINI_API_KEY
          : "MISSING",
      )}
      <div className="app" id="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/games">
                <Route path="face-reading" element={<FaceReading />}></Route>
                <Route path="emotion-arena" element={<EmotionArena />}></Route>
                <Route path="job-prediction" element={<JobPrediction />} />
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
