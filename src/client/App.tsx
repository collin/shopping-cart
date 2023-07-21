import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/catalog" element={<div>Catalog</div>} />
      </Routes>
    </div>
  );
}

export default App;
