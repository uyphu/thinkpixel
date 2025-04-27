import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer/:algorithmName" element={<Visualizer />} />
        <Route path="/about" element={<About />} /> 
        {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
