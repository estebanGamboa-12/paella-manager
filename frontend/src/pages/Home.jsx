import { useEffect, useState } from "react";
import { API } from "../api/api";
import ClientCard from "../components/ClientCard";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(4); // 👈 clientes por página

  // 🔍 Buscar clientes o listar todos
  const fetchClients = async () => {
    setLoading(true);
    try {
      const url = search
        ? `/clients/search/?q=${encodeURIComponent(search)}`
        : `/clients/`;
      const res = await API.get(url);
      setClients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  // 🔢 Calcular paginación
  const totalPages = Math.ceil(clients.length / perPage);
  const start = (page - 1) * perPage;
  const visibleClients = clients.slice(start, start + perPage);

  // 🕓 Formatear fecha
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 md:mb-0 flex items-center gap-2">
          📋 Lista de Clientes
        </h1>

        {/* 🔍 Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre, apellidos o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando clientes...</p>
      ) : visibleClients.length > 0 ? (
        visibleClients.map((c) => (
          <ClientCard
            key={c.id}
            client={{
              ...c,
              fecha_creacion: formatDate(c.fecha_creacion),
            }}
            onStatusChange={fetchClients}
          />
        ))
      ) : (
        <p className="text-center text-gray-400">No se encontraron resultados.</p>
      )}

      {/* 🔢 Controles de paginación */}
      {clients.length > perPage && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ⬅️ Anterior
          </button>
          <span className="px-4 py-2 font-medium text-gray-700">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Siguiente ➡️
          </button>
        </div>
      )}
    </div>
  );
}
