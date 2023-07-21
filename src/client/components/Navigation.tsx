import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/catalog">Catalog</Link>
    </nav>
  );
}
