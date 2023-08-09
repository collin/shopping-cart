import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./components/Navigation";
import { Catalog } from "./pages/Catalog";
import { Homepage } from "./pages/Homepage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { useCurrentUser } from "./providers/CurrentUserProvider";

const RedirectToProfileIfLoggedIn = () => {
  const [currentUser] = useCurrentUser();

  if (currentUser) {
    return <Navigate to="/profile" />;
  }

  return <Outlet />;
};

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/catalog" element={<Catalog />} />

        <Route path="/profile" element={<Profile />} />

        <Route element={<RedirectToProfileIfLoggedIn />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
