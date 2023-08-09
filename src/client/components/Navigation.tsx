import { Link } from "react-router-dom";
import { useCurrentUser } from "../providers/CurrentUserProvider";
import { Logout } from "./Logout";

export function Navigation() {
  const [currentUser] = useCurrentUser();
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/catalog">Catalog</Link>
      {!currentUser && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      {currentUser && (
        <>
          <Link to="/profile">Profile</Link>
          <Logout />
        </>
      )}
    </nav>
  );
}
