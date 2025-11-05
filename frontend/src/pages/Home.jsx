import { useEffect, useState } from "react";
import { API } from "../api/api";
import ClientCard from "../components/ClientCard";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pendientes");
  const [page, setPage] = useState(1);
  const [perPage] = useState(4);

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

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este registro?")) return;

    try {
      await API.delete(`/clients/${id}`);
      setClients(clients.filter((c) => c.id !== id));
    } catch (error) {
      alert("Error: no se pudo eliminar ❌");
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  useEffect(() => {
    let filtered = [...clients];
    if (filter === "pendientes") filtered = clients.filter((c) => !c.devuelto);
    if (filter === "devueltas") filtered = clients.filter((c) => c.devuelto);
    setFilteredClients(filtered);
    setPage(1);
  }, [clients, filter]);

  const totalPages = Math.ceil(filteredClients.length / perPage);
  const start = (page - 1) * perPage;
  const visibleClients = filteredClients.slice(start, start + perPage);

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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
          📋 Lista de Clientes
        </h1>

        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-96 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("pendientes")}
          className={`px-4 py-2 rounded-full ${
            filter === "pendientes" ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-100"
          }`}
        >
          ⏳ Pendientes
        </button>

        <button
          onClick={() => setFilter("devueltas")}
          className={`px-4 py-2 rounded-full ${
            filter === "devueltas" ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100"
          }`}
        >
          ✅ Devueltas
        </button>

        <button
          onClick={() => setFilter("todas")}
          className={`px-4 py-2 rounded-full ${
            filter === "todas" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-gray-100"
          }`}
        >
          📦 Todas
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando clientes...</p>
      ) : visibleClients.length > 0 ? (
        visibleClients.map((c) => (
          <ClientCard
            key={c.id}
            client={{ ...c, fecha_creacion: formatDate(c.fecha_creacion) }}
            onStatusChange={fetchClients}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p className="text-center text-gray-400">No se encontraron resultados.</p>
      )}

      {filteredClients.length > perPage && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            ⬅️ Anterior
          </button>

          <span>Página {page} de {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Siguiente ➡️
          </button>
        </div>
      )}
    </div>
  );
}
