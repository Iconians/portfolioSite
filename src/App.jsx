import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AboutModal } from "./Components/AboutModal/AboutModal";
import { Home } from "./Components/Home/Home";
import { ScheduleModal } from "./Components/ScheduleModal/ScheduleModal";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutModal />} />
          <Route path="/schedule" element={<ScheduleModal />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
