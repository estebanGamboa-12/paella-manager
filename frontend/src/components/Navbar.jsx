import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const active = "text-blue-600 font-semibold";

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary">PaellaManager</h1>
      <div className="flex gap-6">
        <Link to="/" className={pathname === "/" ? active : ""}>Inicio</Link>
        <Link to="/nuevo" className={pathname === "/nuevo" ? active : ""}>Nueva</Link>
        <Link to="/buscar" className={pathname === "/buscar" ? active : ""}>Buscar</Link>
           <Link to="/dashboard" className={pathname === "/buscar" ? active : ""}>Dashboard</Link>

      </div>
    </nav>
  );
}
