import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import AddClient from "../pages/AddClient";
import SearchClient from "../pages/SearchClient";
import Dashboard from "../pages/Dashboard";
import { Plus } from "lucide-react";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo" element={<AddClient />} />
          <Route path="/buscar" element={<SearchClient />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

      {/* 🟦 Botón flotante global */}
      <Link
  to="/nuevo"
  className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
>
  <Plus size={24} />
</Link>
    </BrowserRouter>
  );
}
