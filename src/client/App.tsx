import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./components/Navigation";
import { Catalog } from "./pages/Catalog";
import { Homepage } from "./pages/Homepage";
import { Register } from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
