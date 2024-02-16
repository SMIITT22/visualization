import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import MainContent from "./components/MainContent/MainContent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutUs from "./components/AboutUs/AboutUs";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route
            path="/about-us"
            element={<AboutUs />}
          />
          <Route
            path="/"
            element={<MainContent />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
