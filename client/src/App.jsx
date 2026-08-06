import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddFeedback from "./pages/AddFeedback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-feedback" element={<AddFeedback />} />
    </Routes>
  );
}

export default App;
