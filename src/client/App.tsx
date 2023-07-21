import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./components/Navigation";
import { Catalog } from "./pages/Catalog";
import { Homepage } from "./pages/Homepage";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </div>
  );
}

export default App;
