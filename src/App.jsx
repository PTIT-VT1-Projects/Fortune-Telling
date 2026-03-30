import "./App.css";

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";

import Features from "./pages/Features/Features";
import Games from "./pages/Games";
import Header from "./components/Header";
import FaceReading from "./pages/games/face-reading/index";

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
                <Route path="emotion-area" element={<FaceReading />}></Route>
                <Route path="" index element={<Games />} />
              </Route>
              <Route path="/features" element={<Features />} />
              <Route path="/" element={<Navigate to="/games" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
