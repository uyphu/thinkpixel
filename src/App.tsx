import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Visualizer from "./pages/Visualizer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer/:algorithmName" element={<Visualizer />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
