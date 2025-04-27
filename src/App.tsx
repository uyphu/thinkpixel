import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// Later import Visualizer page too

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Other routes like Visualizer later */}
      </Routes>
    </Router>
  )
}

export default App;
